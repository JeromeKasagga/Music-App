import os
import time
import yt_dlp
import tempfile
import ffmpeg
from django.core.files.uploadedfile import SimpleUploadedFile


import boto3
from botocore.config import Config
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Song



# Audio Compression view
def compress_audio(uploaded_file):
    """Compresses an uploaded audio file to a high-quality MP3 using FFmpeg."""
    # Create temporary files to hold the original and compressed audio
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{uploaded_file.name.split('.')[-1]}") as temp_in:
        for chunk in uploaded_file.chunks():
            temp_in.write(chunk)
        temp_in_path = temp_in.name

    temp_out_path = temp_in_path + "_compressed.mp3"

    try:
        # Run FFmpeg: compress to MP3, Variable Bitrate -V2 (~190kbps)
        (
            ffmpeg
            .input(temp_in_path)
            .output(temp_out_path, acodec='libmp3lame', **{'q:a': 2}, ar='44100')
            .overwrite_output()
            .run(quiet=True)
        )

        # Read the compressed file back into memory
        with open(temp_out_path, 'rb') as f:
            compressed_content = f.read()

        # Create a new Django file object with the compressed content
        compressed_file = SimpleUploadedFile(
            name=f"{uploaded_file.name.rsplit('.', 1)[0]}.mp3",
            content=compressed_content,
            content_type='audio/mpeg'
        )
        return compressed_file

    except Exception as e:
        print(f"Compression failed: {e}")
        return uploaded_file  # Return the original if compression fails

    finally:
        # Clean up temporary files
        if os.path.exists(temp_in_path): os.remove(temp_in_path)
        if os.path.exists(temp_out_path): os.remove(temp_out_path)

# Song Upload View
class SongUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("file")
        title = request.data.get("title", "Unknown Title")
        artist = request.data.get("artist", "Unknown Artist")
        duration = request.data.get("duration", "0:00")

        if not file:
            return Response(
                {"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        file = compress_audio(file)

        # Read env vars once and validate
        r2_endpoint = os.getenv("R2_ENDPOINT_URL")
        r2_access_key = os.getenv("R2_ACCESS_KEY_ID")
        r2_secret_key = os.getenv("R2_SECRET_ACCESS_KEY")
        r2_bucket = os.getenv("R2_BUCKET_NAME")
        r2_public_url = os.getenv("R2_PUBLIC_URL")

        missing = [
            name
            for name, val in [
                ("R2_ENDPOINT_URL", r2_endpoint),
                ("R2_ACCESS_KEY_ID", r2_access_key),
                ("R2_SECRET_ACCESS_KEY", r2_secret_key),
                ("R2_BUCKET_NAME", r2_bucket),
                ("R2_PUBLIC_URL", r2_public_url),
            ]
            if not val
        ]
        if missing:
            return Response(
                {"error": f"Missing environment variables: {', '.join(missing)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # 1. Connect to Cloudflare R2 using boto3
        s3_client = boto3.client(
            "s3",
            endpoint_url=r2_endpoint,
            aws_access_key_id=r2_access_key,
            aws_secret_access_key=r2_secret_key,
            config=Config(signature_version="s3v4"),
        )

        # 2. Create unique filename (Force .mp3 extension now)
        unique_filename = f"songs/{int(time.time())}_{title.replace(' ', '_')}.mp3"

        try:
            # 3. Upload to R2
            s3_client.upload_fileobj(
                file,
                r2_bucket,
                unique_filename,
                ExtraArgs={"ContentType": "audio/mpeg"} # Force audio/mpeg
            )

            # 4. Construct the Public URL
            public_url = f"{r2_public_url}/{unique_filename}"

            # 5. Save to DB
            song = Song.objects.create(
                title=title,
                artist=artist,
                duration=duration,
                file_url=public_url,
                owner=request.user,
            )

            return Response(
                {
                    "message": "Upload successful!",
                    "song": {
                        "id": song.id,
                        "title": song.title,
                        "artist": song.artist,
                        "url": public_url,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            print(f"R2 Upload Error: {e}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# Song List View
class SongListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        songs = Song.objects.filter(owner=request.user).order_by("-created_at")

        song_data = [
            {
                "id": song.id,
                "title": song.title,
                "artist": song.artist,
                "file_url": song.file_url,
                "cover_image_url": getattr(song, "cover_image_url", None),
                "created_at": song.created_at,
            }
            for song in songs
        ]

        return Response(song_data)


# Helper to build yt-dlp options with cookies and mobile client emulation
def get_yt_dlp_options(out_template=None, search_only=False):
    opts = {
        "quiet": True,
        "noplaylist": True,
        "extractor_args": {
            "youtube": {
                "player_client": ["android", "ios", "mweb"]
            }
        },
    }

    if search_only:
        opts["format"] = "bestaudio/best"
        opts["extract_flat"] = True
    else:
        opts["format"] = "bestaudio/best"
        opts["postprocessors"] = [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "mp3",
                "preferredquality": "192",
            }
        ]
        if out_template:
            opts["outtmpl"] = out_template

    # Check for cookies: Render Secret File, custom env path, project root, or env string
    cookie_path = os.getenv("YOUTUBE_COOKIE_PATH", "/etc/secrets/cookies.txt")
    local_cookie = os.path.join(settings.BASE_DIR, "cookies.txt")
    if os.path.exists(cookie_path):
        opts["cookiefile"] = cookie_path
    elif os.path.exists(local_cookie):
        opts["cookiefile"] = local_cookie
    elif os.getenv("YOUTUBE_COOKIES_TEXT"):
        cookie_temp = os.path.join(tempfile.gettempdir(), "yt_cookies.txt")
        with open(cookie_temp, "w") as f:
            f.write(os.getenv("YOUTUBE_COOKIES_TEXT"))
        opts["cookiefile"] = cookie_temp

    return opts


# Youtube DownloadView
class YouTubeDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        video_url = request.data.get("url")
        if not video_url:
            return Response(
                {"error": "No URL provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Set up yt-dlp options
        temp_dir = tempfile.gettempdir()
        out_template = os.path.join(temp_dir, "%(id)s.%(ext)s")
        ydl_opts = get_yt_dlp_options(out_template=out_template, search_only=False)

        try:
            # 2. Download the audio
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(video_url, download=True)
                title = info.get("title", "Unknown Title")
                artist = info.get("uploader", "Unknown Artist")
                video_id = info.get("id")

                # The downloaded file will be named <video_id>.mp3
                downloaded_file_path = os.path.join(temp_dir, f"{video_id}.mp3")

            # 3. Upload to Cloudflare R2
            s3_client = boto3.client(
                "s3",
                endpoint_url=os.getenv("R2_ENDPOINT_URL"),
                aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
                config=Config(signature_version="s3v4"),
            )

            r2_bucket = os.getenv("R2_BUCKET_NAME")
            r2_public_url = os.getenv("R2_PUBLIC_URL")
            unique_filename = f"songs/{int(time.time())}_{video_id}.mp3"

            # Upload the file to R2
            with open(downloaded_file_path, "rb") as f:
                s3_client.upload_fileobj(
                    f,
                    r2_bucket,
                    unique_filename,
                    ExtraArgs={"ContentType": "audio/mpeg"},
                )

            public_url = f"{r2_public_url}/{unique_filename}"

            # 4. Save to Database
            song = Song.objects.create(
                title=title,
                artist=artist,
                duration="0:00",  
                file_url=public_url,
                owner=request.user,
            )

            # 5. Clean up the temporary file
            if os.path.exists(downloaded_file_path):
                os.remove(downloaded_file_path)

            return Response(
                {
                    "message": "YouTube download successful!",
                    "song": {
                        "id": song.id,
                        "title": song.title,
                        "artist": song.artist,
                        "url": public_url,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            err_str = str(e)
            print(f"YouTube Download Error: {err_str}")
            if "confirm you’re not a bot" in err_str or "confirm you're not a bot" in err_str or "bot" in err_str.lower():
                return Response(
                    {
                        "error": "YouTube blocked this download request due to cloud IP bot verification. "
                                 "Please configure a YouTube cookies file on the server or upload your MP3 directly."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )
            return Response(
                {"error": err_str}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# youtube search view
class YouTubeSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get("q")
        if not query:
            return Response(
                {"error": "Search query required"}, status=status.HTTP_400_BAD_REQUEST
            )

        ydl_opts = get_yt_dlp_options(search_only=True)

        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # ytsearch5: fetches the top 5 results
                result = ydl.extract_info(f"ytsearch5:{query}", download=False)

                # Format the results for React
                videos = result.get("entries", [])
                formatted_results = []
                for vid in videos:
                    if vid:
                        formatted_results.append(
                            {
                                "id": vid.get("id"),
                                "title": vid.get("title"),
                                "uploader": vid.get("uploader"),
                                "url": f"https://www.youtube.com/watch?v={vid.get('id')}",
                                "duration": vid.get("duration"),
                            }
                        )

                return Response(
                    {"results": formatted_results}, status=status.HTTP_200_OK
                )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# Deletefsunction
class SongDeleteView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            song = Song.objects.get(id=pk, owner=request.user)
            
            # 1. Delete from R2
            try:
                # Connect to R2
                s3_client = boto3.client(
                    "s3",
                    endpoint_url=os.getenv("R2_ENDPOINT_URL"),
                    aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
                    aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
                    config=Config(signature_version="s3v4"),
                )
                
                # Extract the file key from the full public URL
                r2_public_url = os.getenv("R2_PUBLIC_URL")
                file_key = song.file_url.replace(f"{r2_public_url}/", "")
                
                # Delete the object from the bucket
                s3_client.delete_object(
                    Bucket=os.getenv("R2_BUCKET_NAME"),
                    Key=file_key
                )
            except Exception as r2_error:
                print(f"R2 Delete Error (ignoring and deleting DB record): {r2_error}")

            # 2. Delete from Database
            song.delete()
            
            return Response({"message": "Song and R2 file deleted"}, status=status.HTTP_204_NO_CONTENT)
            
        except Song.DoesNotExist:
            return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)