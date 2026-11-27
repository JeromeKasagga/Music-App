# Music-App

A full-stack music streaming platform where users can sign in, manage a library, and stream audio. 


<img width="1385" height="849" alt="Screenshot 2026-11-28 at 01 06 06" src="https://github.com/user-attachments/assets/d39cce31-f170-4a3d-bbb3-660a8eee1fc5" />

<img width="1385" height="849" alt="Screenshot 2026-11-28 at 01 06 32" src="https://github.com/user-attachments/assets/d357e700-8c91-4f8c-a62b-b74318a424fc" />

<img width="1385" height="849" alt="Screenshot 2026-11-28 at 01 06 46" src="https://github.com/user-attachments/assets/ebaa86d0-2073-4101-828c-6098fea5dcf5" />

<img width="1385" height="849" alt="Screenshot 2026-11-28 at 01 07 18" src="https://github.com/user-attachments/assets/0604937f-01de-4cb4-8a03-deb6ee29af2c" />

<img width="1385" height="849" alt="Screenshot 2026-11-28 at 01 07 31" src="https://github.com/user-attachments/assets/1aabb9c7-f031-433f-80f0-ee8db4fabb2c" />

## Architecture
This repository is split into two main directories:
*   [**Frontend**](./Frontend): React, Vite, and Tailwind CSS application.
*   [**Backend**](./Backend): Django REST Framework API handling authentication and file management.

## Tech Stack
*   **Frontend:** React, Vite, Tailwind CSS
*   **Backend:** Python, Django, Django REST Framework
*   **Database:** Supabase (PostgreSQL)
*   **Storage:** Cloudflare R2
*   **Authentication:** JWT (JSON Web Tokens)
*   **Hosting:** Render (Backend)

## Features
*   JWT-based user authentication.
*   Stream audio tracks directly from the browser.
*   Manage a personal music library.

## Known Limitations
*   **File Uploads:** File uploading is currently unreliable in production. The backend on Render reaches its request limit on larger files. I am actively working on implementing direct-to-R2 uploads to bypass the server.
*   **Downloads:** The download feature currently works only in local development and is disabled in the deployed version.
*   **YouTube Integration:** The app does not use YouTube as a source for audio. 

## What I Learned
Building this project taught me how to connect a React frontend to a Django REST API, how to handle JWT authentication, and the challenges of managing file storage and request limits in production cloud environments.

## Author
*   **Jerome Kasagga** - [Portfolio](https://jeromekasagga.vercel.app/) | [GitHub](https://github.com/JeromeKasagga)
```

**GitHub About Description:** Full-stack music streaming app built with React, Django REST Framework, and Tailwind CSS.
**GitHub Topics:** `react` `django` `django-rest-framework` `tailwindcss` `music-streaming`

***

### 2. Frontend `README.md` (Inside `/Frontend`)

```markdown
# Music-App Frontend

React and Vite frontend for the Music-App platform.

![screenshot](./screenshot.png)

## Features
*   User authentication (Login/Signup) via JWT.
*   Global audio player context.
*   Library management and search functionality.
*   Responsive design for desktop and mobile.

## Tech Stack
*   React
*   Vite
*   Tailwind CSS
*   React Context (for state management)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure
*   `/src/components`: Reusable UI components (PlayerBar, MusicLibrary, etc.).
*   `/src/Context`: React Context providers (e.g., PlayerContext).
*   `/src/hooks`: Custom React hooks.

## Known Limitations
*   The "Download" button functionality is currently only functional when running the frontend and backend locally. It is disabled on the deployed version.

## Author
*   **Jerome Kasagga** - [Portfolio](https://jeromekasagga.vercel.app/) | [GitHub](https://github.com/JeromeKasagga)
```

**GitHub About Description:** React and Tailwind frontend for a full-stack music streaming application.
**GitHub Topics:** `react` `vite` `tailwindcss` `frontend` `music-player`

***

### 3. Backend `README.md` (Inside `/Backend`)

```markdown
# Music-App Backend

Django REST Framework API for the Music-App platform.

![screenshot](./screenshot.png)

## Features
*   Custom User model with JWT authentication (SimpleJWT).
*   API endpoints for song management and user libraries.
*   Audio compression using FFmpeg.
*   Cloud storage integration with Cloudflare R2.

## Tech Stack
*   Python
*   Django
*   Django REST Framework
*   Supabase (Database)
*   Cloudflare R2 (Storage)
*   FFmpeg (Audio processing)

## Environment Variables
To run this project, you need to add the following environment variables to your `.env` file:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=your_supabase_postgres_url
AWS_ACCESS_KEY_ID=your_r2_access_key
AWS_SECRET_ACCESS_KEY=your_r2_secret_key
AWS_STORAGE_BUCKET_NAME=your_r2_bucket_name
AWS_S3_ENDPOINT_URL=your_r2_endpoint
```

## Getting Started

1. Create a virtual environment and activate it.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```

## Known Limitations
*   **Production Upload Limits:** The backend is currently hosted on Render's free tier, which has strict request size and memory limits. Uploading large audio files often fails. A direct-to-cloud upload system is needed to resolve this.
*   **YouTube Downloads:** Attempts to download audio directly from YouTube on the deployed server are blocked by YouTube's bot protection. The app currently relies on manual file uploads.

## Author
*   **Jerome Kasagga** - [Portfolio](https://jeromekasagga.vercel.app/) | [GitHub](https://github.com/JeromeKasagga)
```

**GitHub About Description:** Django REST API for a music streaming app with JWT auth and Cloudflare R2 integration.
**GitHub Topics:** `django` `django-rest-framework` `python` `api` `cloudflare-r2`
