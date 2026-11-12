# Backend Implementation Guide: Django + Supabase for Music App

This guide outlines how to build the backend for your Music App using **Django** (for the API logic) and **Supabase** (for the Database and File Storage).

## 1. Architecture Overview

-   **Frontend (React)**: Handles the UI, captures the file upload, and plays the music.
-   **Backend (Django)**: Receives requests from the frontend, manages authentication (optional), and coordinates with Supabase.
-   **Database (Supabase PostgreSQL)**: Stores metadata about songs (Title, Artist, Duration, URL).
-   **Storage (Supabase Storage)**: Stores the actual MP3 audio files.

---

## 2. Prerequisites

1.  **Supabase Account**: Create a project at [supabase.com](https://supabase.com).
2.  **Python Installed**: Ensure you have Python on your machine.
3.  **Django**: We will install this.

---

## 3. Supabase Setup

### Step A: Create Project
1.  Log in to Supabase and create a new project.
2.  Note down your **Project URL** and **API Key (service_role or anon)** from *Project Settings > API*.
3.  Note down your **Database Connection String** from *Project Settings > Database*.

### Step B: Create a Storage Bucket
1.  Go to **Storage** in the Supabase dashboard.
2.  Create a new public bucket named `music-files`.
3.  Set the policy to allow "Public Access" (so users can play songs without complex tokens for now).

---

## 4. Django Setup

### Step A: Initialize Project
Create a folder for your backend and initialize it.

```bash
mkdir music_backend
cd music_backend
python3 -m venv venv
source venv/bin/activate  # on Windows: venv\Scripts\activate

pip install django djangorestframework django-cors-headers psycopg2-binary dj-database-url supabase
```

### Step B: Create Django App
```bash
django-admin startproject config .
python manage.py startapp songs
```

### Step C: Configure `settings.py`
Edit `config/settings.py`:

```python
import dj_database_url
import os

# ... existing code ...

INSTALLED_APPS = [
    # ... django apps ...
    'rest_framework',
    'corsheaders',
    'songs',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Add this at the top
    # ... existing middleware ...
]

# Allow React Frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

# Database Config (Connect to Supabase Postgres)
DATABASES = {
    'default': dj_database_url.config(default='postgres://[YOUR_USER]:[YOUR_PASSWORD]@[YOUR_HOST]:5432/postgres')
}

# Supabase Credentials (add these to logic later)
SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_KEY = "your-service-role-key" 
```

---

## 5. The Logic (How Upload Works)

### Step A: The Song Model (`songs/models.py`)
This stores the *metadata* of the song.

```python
from django.db import models

class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    album = models.CharField(max_length=200, blank=True, null=True)
    duration = models.CharField(max_length=10) # e.g. "3:45"
    file_url = models.URLField() # Link to Supabase Storage
    cover_image_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
```

### Step B: The Upload View (`songs/views.py`)
This is the magic part. It receives the file and sends it to Supabase Storage.

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from supabase import create_client, Client
from django.conf import settings
from .models import Song
import time

class SongUploadView(APIView):
    def post(self, request):
        file = request.FILES.get('file')
        title = request.data.get('title')
        artist = request.data.get('artist')

        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Initialize Supabase Client
        supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

        # 2. Upload File to Supabase Storage
        # Create a unique filename
        file_path = f"songs/{int(time.time())}_{file.name}"
        file_content = file.read()
        
        try:
            res = supabase.storage.from_("music-files").upload(
                file=file_content,
                path=file_path,
                file_options={"content-type": "audio/mpeg"}
            )
            
            # 3. Get Public URL
            public_url = supabase.storage.from_("music-files").get_public_url(file_path)

            # 4. Save Metadata to Django DB (Supabase Postgres)
            song = Song.objects.create(
                title=title,
                artist=artist,
                file_url=public_url,
                duration="0:00" # You might need a library like mutagen to extract real duration
            )

            return Response({
                "message": "Upload successful",
                "song_id": song.id,
                "url": public_url
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SongListView(APIView):
    def get(self, request):
        songs = Song.objects.all().values()
        return Response(list(songs))
```

### Step C: URLs (`songs/urls.py`)

```python
from django.urls import path
from .views import SongUploadView, SongListView

urlpatterns = [
    path('upload/', SongUploadView.as_view()),
    path('list/', SongListView.as_view()),
]
```

---

## 6. How it connects to React

1.  **Frontend**: User clicks "Upload", selects a file.
2.  **React**: Creates a `FormData` object.
    ```javascript
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', 'My Song');
    formData.append('artist', 'Me');

    fetch('http://localhost:8000/songs/upload/', {
        method: 'POST',
        body: formData
    })
    ```
3.  **Backend**: Django receives it, pushes the binary file to Supabase Cloud Storage, gets a URL back (e.g., `https://xyz.supabase.co/storage/v1/object/public/music-files/song.mp3`), and saves that URL in the database.
4.  **Retrieval**: When you load the library, React asks `GET /songs/list/`. Django returns:
    ```json
    [
      {
        "title": "My Song",
        "file_url": "https://xyz.../song.mp3"
      }
    ]
    ```
5.  **Playing**: React sets the `<audio src={song.file_url} />` and it streams directly from Supabase.
