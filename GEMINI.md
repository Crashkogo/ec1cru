# Project Overview

This is a full-stack web application with a React frontend and a Node.js backend. The application serves as an informational website with an admin panel for managing content.

## Key Technologies

*   **Frontend:**
    *   React 18
    *   TypeScript
    *   Vite
    *   Tailwind CSS
    *   Redux Toolkit
    *   React Router
    *   TinyMCE
    *   Framer Motion
    *   React Hook Form + Zod
    *   reCAPTCHA v3
*   **Backend:**
    *   Node.js
    *   Express
    *   Prisma
    *   PostgreSQL
    *   JWT for authentication
    *   Nodemailer for sending emails
    *   Winston for logging
    *   express-fileupload for file uploads
*   **Database:**
    *   PostgreSQL with models for User, News, Events (with registrations), Promotions, ReadySolution + Program (many-to-many).

## Architecture

The project is divided into two main parts: a `frontend` directory and a `backend` directory.

*   The **frontend** is a single-page application built with React and Vite. It provides the user interface for the public website and the admin panel.
*   The **backend** is a Node.js application using the Express framework. It provides a RESTful API for the frontend to interact with the database. Prisma is used as the ORM for interacting with the PostgreSQL database.

# Building and Running

## Frontend

To run the frontend in development mode:

```bash
cd frontend
npm install
npm run dev
```

To build the frontend for production:

```bash
cd frontend
npm run build
```

To run tests:

```bash
cd frontend
npm run test
```

## Backend

To run the backend in development mode:

```bash
cd backend
npm install
npm run dev
```

To build the backend for production:

```bash
cd backend
npm run build
```

To start the backend in production:

```bash
cd backend
npm run start
```

# Development Conventions

*   The frontend code is located in the `frontend/src` directory.
*   The backend code is located in the `backend/src` directory.
*   The database schema is managed by Prisma and can be found in `backend/prisma/schema.prisma`.
*   The frontend uses `eslint` and `prettier` for code linting and formatting.
*   The project uses `lint-staged` to run `eslint` and `prettier` on staged files before committing.
*   The backend uses `tsx` for running TypeScript code in development.
