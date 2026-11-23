from django.contrib import admin
from django.urls import path
from songs.views import SongUploadView, SongListView, YouTubeDownloadView, YouTubeSearchView, SongDeleteView
urlpatterns = [
    path("api/songs/youtube/", YouTubeDownloadView.as_view()),
]
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/songs/upload/", SongUploadView.as_view()),
    path("api/songs/", SongListView.as_view()),
    path('api/songs/youtube/', YouTubeDownloadView.as_view()),
    path('api/youtube/search/', YouTubeSearchView.as_view()),
     path('api/songs/<int:pk>/', SongDeleteView.as_view()),
    # AUTH Endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
