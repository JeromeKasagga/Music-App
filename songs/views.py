from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from supabase import create_client, Client
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from .models import Song
import os
import time


# Song Upload View
class SongUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        title = request.data.get('title', 'Unknown Title')
        artist = request.data.get('artist', 'Unknown Artist')
        duration = request.data.get('duration', '0:00')

        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Connect to Supabase
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        supabase: Client = create_client(url, key)

        # 2. Create unique filename
        file_extension = file.name.split('.')[-1]
        unique_filename = f"songs/{int(time.time())}_{title.replace(' ', '_')}.{file_extension}"
        file_content = file.read()

        try:
            # 3. Upload to Supabase
            supabase.storage.from_("music-files").upload(
                file=file_content,
                path=unique_filename,
                file_options={"content-type": file.content_type}
            )

            public_url = supabase.storage.from_("music-files").get_public_url(unique_filename)

            # 4. Save to DB
            song = Song.objects.create(
                title=title,
                artist=artist,
                duration=duration,
                file_url=public_url,
                owner=request.user
            )

            return Response({
                "message": "Upload successful!",
                "song": {
                    "id": song.id,
                    "title": song.title,
                    "artist": song.artist,
                    "url": public_url
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# Song List View
class SongListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only get songs when the user is making the request
        songs = Song.objects.filter(owner=request.user).order_by('-created_at')

        # Convert the database onject into a list of dictionaries (JSON)
        song_data = []
        for song in songs:
            song_data.append({
                "id": song.id,
                "title": song.title,
                "artist": song.artist,
                "file_url": song.file_url,
                "cover_image_url": song.cover_image_url,
                "created_at": song.created_at
            })

        return Response(song_data)
    