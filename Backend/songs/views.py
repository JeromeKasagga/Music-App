import os
import time
import yt_dlp
import tempfile
import subprocess

import boto3
from botocore.config import Config
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from yt_dlp.networking.impersonate import ImpersonateTarget
import imageio_ffmpeg

from .models import Song


def compress_to_temp(uploaded_file):
    """
    Write the upload to disk, run ffmpeg at 128kbps, return the output
    temp file PATH (not loaded into RAM). Caller must delete it.
    Returns (temp_out_path, error_string_or_None).
    """
    ext = os.path.splitext(uploaded_file.name)[-1].lower() or ".mp3"
    temp_in = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    temp_out_path = temp_in.name + "_out.mp3"

    try:
        # Write upload chunks straight to disk — never held in RAM all at once
        for chunk in uploaded_file.chunks():
            temp_in.write(chunk)
        temp_in.close()

        ffmpeg_path = imageio_ffmpeg.get_ffmpeg_exe()
        result = subprocess.run(
            [
                ffmpeg_path,
                "-threads", "1",        # single-threaded keeps RAM ~50-80 MB
                "-i", temp_in.name,
                "-vn",                  # drop any embedded video/cover track
                "-acodec", "libmp3lame",
                "-b:a", "128k",         # fixed 128 kbps — CD quality, ~1 MB/min
                "-ar", "44100",
                "-map_metadata", "-1",  # strip bulky YouTube metadata blocks
                temp_out_path,
                "-y",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,     # capture stderr so we can log errors
        )

        if result.returncode != 0:
            err = result.stderr.decode(errors="replace")
            print(f"[compress_to_temp] ffmpeg error:\n{err}")
            return None, err

        return temp_out_path, None

    except Exception as e:
        print(f"[compress_to_temp] exception: {e}")
        return None, str(e)
    finally:
        # Always remove the input temp file
        if os.path.exists(temp_in.name):
            os.remove(temp_in.name)


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

        # Compress to a temp file on disk (never loads whole file into RAM)
        temp_out_path, err = compress_to_temp(file)
        if temp_out_path is None:
            return Response(
                {"error": f"Audio compression failed: {err}"},
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

        # Always .mp3 after compression
        unique_filename = f"songs/{int(time.time())}_{title.replace(' ', '_')}.mp3"

        try:
            # 2. Stream compressed file directly into R2 — boto3 reads in 8 MB chunks,
            #    so peak RAM = one chunk (~8 MB), never the whole file
            with open(temp_out_path, "rb") as compressed:
                s3_client.upload_fileobj(
                    compressed,
                    r2_bucket,
                    unique_filename,
                    ExtraArgs={"ContentType": "audio/mpeg"},
                )
        finally:
            # Always clean up the compressed temp file, even on upload error
            if os.path.exists(temp_out_path):
                os.remove(temp_out_path)

        # 3. Construct the Public URL and save to DB
        public_url = f"{r2_public_url}/{unique_filename}"

        try:
            song = Song.objects.create(
                title=title,
                artist=artist,
                duration=duration,
                file_url=public_url,
                owner=request.user,
            )
        except Exception as e:
            print(f"[SongUploadView] DB error: {e}")
            return Response(
                {"error": "File uploaded but failed to save to database."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
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
        "js_runtimes": {"deno": {}},  # Explicitly use Deno
        "remote_components": ["ejs:npm"],
        # "impersonate": "chrome",
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "extractor_args": {
            "youtube": {
                "player_client": ["tv", "mweb"],
            },
        },
    }

    # LINE to properly convert the string to an ImpersonateTarget object
    opts["impersonate"] = ImpersonateTarget.from_str("chrome")

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

    source_cookie = None
    if os.path.exists(cookie_path):
        source_cookie = cookie_path
    elif os.path.exists(local_cookie):
        source_cookie = local_cookie
    elif os.getenv("YOUTUBE_COOKIES_TEXT"):
        # If using an env var string, write it to a temp file first
        fd, temp_cookie = tempfile.mkstemp(prefix="yt_cookies_", suffix=".txt")
        with os.fdopen(fd, "w") as f:
            f.write(os.getenv("YOUTUBE_COOKIES_TEXT"))
        source_cookie = temp_cookie

    if source_cookie:
        # CRITICAL FIX: Copy the read-only cookie to a writable temp file
        fd, writable_cookie = tempfile.mkstemp(prefix="yt_writable_", suffix=".txt")
        os.close(fd)  # Close the file descriptor so yt-dlp can open it
        shutil.copyfile(source_cookie, writable_cookie)
        opts["cookiefile"] = writable_cookie

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
            if (
                "confirm you’re not a bot" in err_str
                or "confirm you're not a bot" in err_str
                or "bot" in err_str.lower()
            ):
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
            import traceback

            print("=== YOUTUBE SEARCH ERROR ===")
            traceback.print_exc()
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
                    Bucket=os.getenv("R2_BUCKET_NAME"), Key=file_key
                )
            except Exception as r2_error:
                print(f"R2 Delete Error (ignoring and deleting DB record): {r2_error}")

            # 2. Delete from Database
            song.delete()

            return Response(
                {"message": "Song and R2 file deleted"},
                status=status.HTTP_204_NO_CONTENT,
            )

        except Song.DoesNotExist:
            return Response(
                {"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND
            )
