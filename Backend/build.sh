#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Download static ffmpeg if not already present
if [ ! -f "ffmpeg" ]; then
  curl -L -o ffmpeg.tar.xz https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
  tar -xf ffmpeg.tar.xz --wildcards "*/ffmpeg" "*/ffprobe" --strip-components=1
  rm ffmpeg.tar.xz
fi
export PATH="$PATH:$PWD"