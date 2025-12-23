# Virtual Classroom Platform - Setup & Usage Instructions

## 🚀 Getting Started

### 1. Backend Server
The backend handles API requests, database connections, and real-time Socket.IO events.

```bash
cd server
npm install
npm run dev
```
*Port: 3000*

### 2. Frontend Client
The frontend is the user interface built with React and Vite.

```bash
cd Classroom
npm install
npm run dev
```
*Port: 5173* (usually)

## ✨ New Features Implemented

### 📱 Premium Dashboard
- **Glassmorphism UI**: Beautiful, modern interface with dark mode support.
- **Class Management**: Teachers can create classes; Students can join by ID.
- **Global Lobby**: A global chat for all online users.

### 🎥 Live Classroom
- **Interactive Whiteboard**: Teachers can draw in real-time, students view instantly.
- **Live Polls**: Teachers create polls; students vote with live results.
- **Assignment Hub**: View assignments and submit work directly.
- **Class Chat**: Persistent chat history for each specific class.
- **Hand Raising**: Students can raise hands to get attention.

### 🛠 Tech Stack Upgrades
- **Database**: Extended MongoDB models for Assignments, Polls, Messages.
- **Real-time**: Socket.IO rooms implementation for isolated class sessions.
- **Security**: JWT Authentication with role-based access control.
