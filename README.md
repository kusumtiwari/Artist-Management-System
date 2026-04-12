Overview

This system allows admins to manage users, artists and songs with secure authentication, role-based authorization, and CRUD operations.
It also supports CSV import/export for artists.

Key Features
-JWT Authentication (login/signup)
-Role-based access control (Admin / User)
-Artist management (CRUD + CSV import/export)
-Song management under artists
-User management with admin controls
-Protected REST APIs using middleware

Frontend
-React (Vite)
-React Query
-TypeScript

Backend
-Node.js + Express
-MySQL
-JWT Authentication
-Multer (file uploads)
-TypeScript

API Highlights
Auth
POST /auth/login
POST /auth/register
Artists
GET /artists
POST /artists (Admin)
PATCH /artists/:id (Admin)
DELETE /artists/:id (Admin)
Songs
GET /songs/artist/:artistId
POST /songs (Admin)
PATCH /songs/:id (Admin)
DELETE /songs/:id (Admin)
Users
GET /users (Admin)
PATCH /users/:id


Create .env files using provided .env.example.
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev
