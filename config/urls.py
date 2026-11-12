
from django.contrib import admin
from django.urls import path
from songs.views import SongUploadView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/songs/upload/', SongUploadView.as_view()),
]
