# AlphaTribe Backend

## Overview

This project is a backend service for a community platform where users can discuss various stocks in the market. Built using the MERN stack (MongoDB, Express.js, Node.js), it includes features for user authentication, stock post management, comments, likes, and real-time updates.

## Features

- **User Authentication:** JWT-based authentication allowing users to register, log in, and update their profile.
- **Stock Post Management:** Users can create, view, delete, and manage stock-related posts.
- **Commenting System:** Users can add and delete comments on posts.
- **Like System:** Users can like or unlike posts, with real-time updates.
- **Filtering and Sorting:** API endpoints to filter and sort posts by stock symbol, tags, creation date, or number of likes.
- **Real-time Updates:** Socket.io integration for real-time notifications on new comments or likes.
- **Pagination:** Basic pagination support for fetching posts.

## Tech Stack

- **MongoDB:** Database for storing users, posts, comments, and likes.
- **Express.js:** Web framework for building RESTful APIs.
- **Node.js:** JavaScript runtime for server-side logic.
- **JWT:** JSON Web Tokens for user authentication.
- **Socket.io:** Real-time communication for updates.

## Getting Started

### Prerequisites

- **Node.js** (version 14 or higher)
- **MongoDB** (local or cloud instance)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/community-platform-backend.git
   cd community-platform-backend

2. **Install Dependencies:**
    ```bash
    npm install

3. **Configure Environment Variables:**
    ```bash
    PORT=5000
    MONGO_URI=mongodb+srv://prakashkumarn413:KNt2EqiSYzJROAF7@cluster0.0k961.mongodb.net/
    JWT_SECRET=secret

4. **Start the server locally:**
    ```bash
    npm run dev

5. **Install Testing Dependencies:**
    ``bash
    npm install --save-dev jest
    npm test

