from django.db import models
from django.conf import settings

# Song model
class Song(models.Model):
    # Link song to user who uploaded it
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='songs', null=True, blank=True)

    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    album = models.CharField(max_length=200, blank=True, null=True)

    # Store the Supabase public url here, not the actual file. Actual file is stored in Supabase storage.
    file_url = models.URLField(max_length=500)
    cover_image_url = models.URLField(max_length=500, blank=True, null=True)

    # Example: "3:45" (Automatic duration calculation to be implemented later)
    duration = models.CharField(max_length=10, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.artist}"
    