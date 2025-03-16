# Nexora Verse - Backend

RESTful API backend for Nexora Verse social platform, featuring real-time capabilities and secure authentication.

## Project Overview

The backend service for Nexora Verse social media platform, built with Node.js and Express. Provides core functionality for user interactions, content management, and real-time communication. Frontend repository available [here](https://github.com/oxamyt/nexora-verse-frontend).

## Features

### Core Features

- **Authentication**

  - GitHub OAuth 2.0 implementation
  - JWT token-based authentication
  - Guest account generation

- **User Management**

  - Follow/Unfollow system
  - Profile customization
  - User search by username
  - Follower/Following statistics

- **Content Management**

  - CRUD operations for posts
  - CRUD operations for comments
  - Post likes/unlikes
  - Image uploads via Cloudinary

- **Real-Time Features**
  - Live message functionality (Socket.io)

### Database Features

- PostgreSQL relational database
- Prisma ORM integration
- Data validation with Zod
- Fake data seeding with Faker.js

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: Passport.js, JWT
- **Real-Time**: Socket.IO
- **Validation**: Zod
- **Testing**: Vitest, Supertest
- **Utilities**: Faker.js, Bcrypt, Cloudinary SDK
