from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from supabase import create_client, Client
from django.conf import settings
import os

class SupabaseTestView(APIView):
    def get(self, request):
        try:
            # Load credentials from settings
            url = os.getenv("SUPABASE_URL")
            key = os.getenv("SUPABASE_SERVICE_KEY")

            if not url or not key:
                return Response({"error: Missing supabase credentials in .env"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # CONNECT TO SUPABASE
            supabase: Client = create_client(url, key)

            # try to list files in the bucket
            res = supabase.storage.from_("music_files").list()

            return Response({
                "message": "Successfully connected to supabase storage!",
                "files_in_bucket": res
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        