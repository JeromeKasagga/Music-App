import os
import time
import yt_dlp
import tempfile

import boto3
from botocore.config import Config
from django.conf import settings
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Song


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

        # 1. Connect to Cloudflare R2 using boto3
        s3_client = boto3.client(
            "s3",
            endpoint_url=r2_endpoint,
            aws_access_key_id=r2_access_key,
            aws_secret_access_key=r2_secret_key,
            config=Config(signature_version="s3v4"),
        )

        # 2. Create unique filename
        file_extension = file.name.split(".")[-1]
        safe_title = title.replace(" ", "_")
        unique_filename = f"songs/{int(time.time())}_{safe_title}.{file_extension}"

        try:
            # 3. Upload to R2
            s3_client.upload_fileobj(
                file,
                r2_bucket,
                unique_filename,
                ExtraArgs={
                    "ContentType": file.content_type or "application/octet-stream"
                },
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


    # Youtube Upl
