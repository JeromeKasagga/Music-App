
from django.contrib import admin
from django.urls import path
from songs.views import SupabaseTestView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/test-supabase/', SupabaseTestView.as_view()),
]
