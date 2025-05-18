🎵 JaMoveo – Realtime Music Collaboration App

JaMoveo is a fullstack application built with React + NestJS that enables musicians to collaborate live using WebSocket technology.

This project was developed as a full-stack coding task, following a strict technical spec including real-time updates, user roles, responsive design, and clean UX.

🔗 Live Links

🌐 Frontend (Netlify): https://jamoveoil.netlify.app

🛠 Backend (Render): https://jamoveo-backend-uez9.onrender.com

🧪 Test Users 


For login -

https://jamoveoil.netlify.app/login

Admin :

Username: admin3

Password: 1234

Player :

Username: rotem3

Password: 1234

For Register -

Admin

URL: https://jamoveoil.netlify.app/signup-admin

Player

URL: https://jamoveoil.netlify.app/signup



🛠 Tech Stack

Frontend: React + Vite + Tailwind CSS

Backend: NestJS + Mongoose + WebSocket (Socket.IO)

Database: MongoDB Atlas

Hosting: Netlify (client) & Render (server)

✅ Features

Authentication & Roles

Signup/Login with role: admin or player

Player selects an instrument

Admin Dashboard

Song search input

Suggested songs list

On song select: triggers songSelected event to all players

Real-time status and controls (scroll, quit session)

Player Experience

Waiting screen until admin selects a song

When a song is selected:

Vocalists see lyrics only

Other instruments see both chords + lyrics

Auto-scroll option for sheet reading

Live Session (WebSocket)

Song selection from admin triggers broadcast to all users

Admin can end session, all players return to home

📱 Responsive Design

Fully responsive layout

Large readable fonts and optimized for mobile users

Header displays user name and instrument

📝 Notes

All routes are managed client-side with React Router

Netlify uses _redirects file to support SPA routing (/* → /index.html 200)

Admin and Player interfaces are separated via routing logic

Full CORS setup is handled for both localhost and Netlify

🙌 Developed by Rotem Iluz

