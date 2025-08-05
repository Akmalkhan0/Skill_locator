# Locator - Service Provider Finder

Locator is a web application that connects service providers with people seeking services. It allows users to create profiles, list their skills, and find service providers based on location and expertise.

## Features

- User authentication with Firebase Authentication
- Profile management for service providers and seekers
- Firestore database integration for storing user data
- Cloudinary integration for photo uploads
- Responsive design for mobile and desktop

## Technologies Used

- React.js with Vite
- Firebase (Authentication, Firestore)
- Cloudinary for image storage
- CSS for styling

## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase account
- Cloudinary account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Firebase and Cloudinary credentials
4. Start the development server:
   ```
   npm run dev
   ```

## Firebase Configuration

The application uses Firebase for authentication and Firestore for data storage. The security rules are configured to allow:
- Read access to the `users` collection for all users
- Write access to user documents only if the authenticated user's UID matches the document ID
- Deny read/write access to all other collections by default

## License

This project is licensed under the MIT License.
