# Office Metaverse

## Overview

The **Office Metaverse** is a 2D virtual office space built using the **Phaser** game engine and **MERN** stack. The project allows users to interact in a virtual environment that mimics an office, where each user is represented by a unique avatar. Users can move around, interact with other users via text, video, or voice chat, and see other users’ status (online/offline). As more users join, the office space dynamically expands.

## Architecture

The project is a full-stack application built using the following technologies:

-   **MERN Stack**: MongoDB, Express, React, Node.js
-   **Phaser**: A popular 2D game engine for creating the virtual office space and handling character interactions.
-   **WebRTC**: For real-time video and voice communication between users.
-   **Socket.IO**: For real-time data synchronization (e.g., user movement, avatar status).
-   **JWT (JSON Web Token)**: For secure user authentication and session management.

## Diagram of the Architecture:

-   **Frontend (React + Phaser)**:
    -   Provides a dynamic user interface for interacting with the virtual office.
    -   Phaser handles avatar movement and interactions within the game space.
    -   React manages the user interface components, such as login, user dashboard, and video call UI.
    - 
-   **Backend (Node.js + Express)**:
    -   Handles API requests, WebSocket connections, and real-time data updates.
    -   Express serves as the RESTful API layer for user authentication, storing user status, and office layout data.
    -   WebSocket (Socket.IO) manages the real-time updates for avatar movement and interactions between users.

-   **Database (MongoDB)**:
    -   Stores user data, avatar information, office layout, and user status (e.g., online/offline).
    -   Ensures persistent user data and scaling as more users join the office.

-   **WebRTC**:
    -   Used for establishing peer-to-peer connections between users for video and voice calls.

-   **Real-time Communication (Socket.IO)**:
    -   Syncs the position and status of users across the network.
    -   Broadcasts avatar movements to other connected clients and handles real-time interactions like text messaging.

## Features

1.  **Virtual Office Space**:
    -   Each user has their own virtual desk and avatar.
    -   Avatars can move around using keyboard arrow keys. (done)
    -   Users can explore the office and visit other users’ desks. (done)

2.  **User Authentication**:
    -   Secure login and registration using JWT. (done)
    -   Users can create profiles and choose avatars.

3.  **Real-time Avatar Status**:
    -   When a user logs in, their avatar appears online and is free to move around.
    -   When a user logs out, the avatar automatically sits at their desk and shows offline status.

4.  **Voice/Video Calls**:
    -   Users can initiate video or voice calls using WebRTC.
    -   One-on-one real-time communication with video/audio streams.

5.  **Text Messaging**:
    -   Users can send messages to each other using real-time chat functionality.
    -   Notifications for incoming messages and calls.

6.  **Dynamic Office Expansion**:
    -   As more users join, the virtual office automatically expands, creating new desks and office areas.
    -   The office layout scales to accommodate more users dynamically.

7.  **Character Animation**:
    -   Smooth animations for avatars, including sitting, walking, and interacting with objects.

8.  **Real-time Synchronization**:
    -   Using WebSocket (Socket.IO), all movements and interactions are synced in real-time.
    -   Other users can see movements and interactions without page refreshes.

Started on 22 October, 2024.