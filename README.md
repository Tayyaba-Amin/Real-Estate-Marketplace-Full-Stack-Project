# Real Estate Marketplace Full Stack Project

A full-stack real estate marketplace built with the MERN stack. The application allows users to browse property listings, search by filters, create and update listings, manage profiles, and sign in with email/password or Google-style auth flow.

## Features

- Browse available property listings on the home page
- Search and filter listings by type, price, offer, furnishing, parking, and text
- View detailed property pages with images and features
- Sign up and sign in with JWT-based authentication
- Secure user profile management
- Create, update, and delete property listings
- Google-auth style flow using Firebase integration
- Responsive UI built with React + Vite + Tailwind CSS

## Tech Stack

Frontend
- React 19
- Vite
- React Router DOM
- Redux Toolkit + Redux Persist
- Tailwind CSS
- Firebase
- Swiper

Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Cookie-based auth session

## Project Structure

```text
Real-Estate-Marketplace-Full-Stack-Project/
├── api/
│   ├── controllers/
│   ├── db/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Prerequisites

Before running this project, make sure you have:

- Node.js 18+
- npm
- MongoDB database (local or MongoDB Atlas)
- Firebase project with web config values

## Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

Create a `.env` file inside the `client` folder:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

## Installation

From the project root:

```bash
npm install
npm install --prefix client
```

## Running the App

Start the backend server:

```bash
npm run dev
```

Start the frontend development server:

```bash
cd client
npm run dev
```

The frontend typically runs on `http://localhost:5173` and the backend runs on `http://localhost:3000`.

## Production Build

To build the frontend for production:

```bash
npm run build
```

This project is configured to serve the built frontend from `client/dist` through the Express backend.

## API Overview

Authentication
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/google`
- `GET /api/auth/signout`

User
- `GET /api/user/:id`
- `PUT /api/user/update/:id`

Listings
- `POST /api/listing/create`
- `GET /api/listing/get`
- `GET /api/listing/get/:id`
- `PUT /api/listing/update/:id`
- `DELETE /api/listing/delete/:id`

## Main App Pages

- Home
- Search
- Listing details
- Sign in
- Sign up
- Profile
- Create listing
- Update listing
- About

## Notes

- The backend uses JWT stored in an HTTP-only cookie for authenticated requests.
- The app uses Firebase configuration for client-side app setup and image storage integration.
- Some pages are protected by a `PrivateRoute` wrapper to restrict access to logged-in users only.

