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
from mutagen.easyid3 import EasyID3
from mutagen.mp3 import MP3

# Song Upload View
class SongUploadView(APIView):
    # check if the user is logged in
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No audio file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # --- NEW: Extract Metadata automatically ---
        title = "Unknown Title"
        artist = "Unknown Artist"
        duration_seconds = 0

        try:
            # mutagen needs to read the file, temporarily move the pointer to the start
            file.seek(0)
            audio = EasyID3(file)
            if 'title' in audio:
                title = audio['title'][0]
            if 'artist' in audio:
                artist = audio['artist'][0]
            
            # Get duration
            file.seek(0)
            mp3 = MP3(file)
            duration_seconds = int(mp3.info.length)
            
            # Convert seconds to "3:45" format
            minutes = duration_seconds // 60
            seconds = duration_seconds % 60
            duration_string = f"{minutes}:{seconds:02d}"

        except Exception as e:
            print(f"Could not read metadata: {e}")
            # Fallback: Use the filename as the title
            title = file.name.replace('.mp3', '').replace('.wav', '')
            duration_string = "0:00"

        # Reset file pointer for the actual upload
        file.seek(0)
        # --- END METADATA EXTRACTION ---

        # 2. Connect to Supabase
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        supabase: Client = create_client(url, key)

        # 3. Create a unique filename
        file_extension = file.name.split('.')[-1]
        unique_filename = f"songs/{int(time.time())}_{title.replace(' ', '_')}.{file_extension}"
        
        file_content = file.read()

        try:
            # 4. Upload to Supabase Storage
            supabase.storage.from_("music-files").upload(
                file=file_content,
                path=unique_filename,
                file_options={"content-type": file.content_type}
            )

            # 5. Get the public URL
            public_url = supabase.storage.from_("music-files").get_public_url(unique_filename)

            # 6. Save to database
            song = Song.objects.create(
                title=title,
                artist=artist,
                file_url=public_url,
                duration=duration_string, 
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
    