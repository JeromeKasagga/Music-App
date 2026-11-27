<!-- ========================================== -->
<!-- FILE 1: TOP-LEVEL README.md (Repository Root) -->
<!-- ========================================== -->

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

<!-- GitHub About Description: Full-stack music streaming app built with React, Django REST Framework, and Tailwind CSS. -->
<!-- GitHub Topics: react, django, django-rest-framework, tailwindcss, music-streaming -->


<!-- ========================================== -->
<!-- FILE 2: Frontend/README.md -->
<!-- ========================================== -->

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
   npm run dev
   npm run build
