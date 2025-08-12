# Skill Locator - Service Finder

**Skill Locator** is a modern web application that helps **service seekers** connect with **verified service providers** based on There Service or there needs or also base on the skill worrker they want means aslo have serach by skills. Built using React.js, Firebase, Firestore Realtime No Sql Databsase, Firebasse Authentication and Cloudinary, the app delivers a fast, secure, and responsive experience for users on both desktop and mobile.

## Live Demo

Ckeck The Latest Live Version of it and also Register If you want: 🔗[Skill Locator](https://akmskilllocator.vercel.app/)

## Key Features

- **Firebase Authentication**: Secure login & registration system
- **Dynamic User Roles**: Separate flows for Seekers and Providers
- **Profile Management**: Users can update personal details, expertise, and more
- **Cloudinary Uploads**: Upload and store profile images and certifications
- **Name + Skill-Based Search**: Find providers by Name, Skills, Category and service type
- **Firestore Integration**: Real-time database for user data and metadata
- **Fully Responsive**: Mobile-first design, optimized for all screen sizes

## Technologies Used

| Tech Stack        | Purpose                                 |
|------------------|------------------------------------------|
| **React + Vite** | Frontend UI & Dev server                 |
| **Firebase Auth**| User authentication & session handling  |
| **Firestore DB** | Real-time NoSQL database                 |
| **Cloudinary**   | Image upload, storage, and optimization |
| **CSS**          | Custom styling                          |
| **JSON**         | Static data for state/district dropdowns|


## 📁 Project Structure (Simplified)

```
📁 Skill_Locator
├── ⚙️.firebaserc
├── ⚙️.gitattributes
├── ⚙️.gitignore
├── 📄README.md
├── 📜eslint.config.js
├── 📋firebase.json
├── 📋firestore.indexes.json
├── ⚙️firestore.rules
├── </>index.html
├── 📋package-lock.json
├── 📋package.json
├── 📁public/
│   ├── 🏞️Loading.png
│   └── 🏞️favicon.png
├── 📁src/
│   ├── 📝App.css
│   ├── ❄️App.jsx
│   ├── 📁component/
│   │   ├── ❄️Footer.jsx
│   │   ├── ❄️Header.jsx
│   │   ├── ❄️Login.jsx
│   │   ├── ❄️OfflinePage.jsx
│   │   ├── ❄️ProfileViewer.jsx
│   │   ├── ❄️Register.jsx
│   │   ├── ❄️Tutorial.jsx
│   │   ├── ❄️home.jsx
│   │   ├── ❄️icon.jsx
│   │   └── ❄️profile.jsx
│   ├── 📁css/
│   │   ├── 📝chat.css
│   │   ├── 📝footer.css
│   │   ├── 📝header.css
│   │   ├── 📝home.css
│   │   ├── 📝login.css
│   │   ├── 📝offline.css
│   │   ├── 📝profile-viewer.css
│   │   ├── 📝profile.css
│   │   ├── 📝register.css
│   │   └── 📝tutorial.css
│   ├── 📁data/
│   │   └── 📋indianStatesDistricts.json
│   ├── ❄️firebase.jsx
│   ├── 📝index.css
│   └── ❄️main.jsx
├── 📋vercel.json
└── 📜vite.config.js

````

## Getting Started

### Prerequisites

Before you begin, make sure you have:

- [Node.js](https://nodejs.org/) and npm installed
- A Firebase project (with Auth & Firestore enabled)
- A Cloudinary account


### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akmalkhan0/Skill_locator.git
   cd locator

2. **Install all dependencies**

   ```bash
   npm install

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Firebase + Cloudinary keys:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_URL=your_upload_URL

4. **Start the development server**

   ```bash
   npm run dev

## Firebase Rules Summary

The Firestore rules are designed to be secure and role-based:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    })

    // Deny all access to other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Screenshots

<img src="https://github.com/user-attachments/assets/033519ae-9093-44c1-b183-aa4923cff203" width= 250>
<img src="https://github.com/user-attachments/assets/eb59e095-df95-4e98-990b-b6401a2fb249" width= 250>
<img src="https://github.com/user-attachments/assets/b3cbf1a0-a1bf-4f74-b544-e1289296293c" width= 250>
<img src="https://github.com/user-attachments/assets/1346e538-f261-4796-9d09-1c4eedd4cd24" width= 250>
<img src="https://github.com/user-attachments/assets/e9d09e9d-9a8a-4793-84ab-99d11c7c7f90" width= 250>


## Roadmap & Future Features

* Advanced search filters (distance, availability, rating, Location, RealTime Location)
* Map-based provider view (Google Maps integration, Skill Locator Nearby)
* In-app chat system (Firebase Realtime Database or Firestore)
* Provider reviews & ratings
* PWA support for installable web app
* Admin dashboard for managing users and categories
* Skill management and also find skil you want in the Nearby Locations

## Credits

Developed with ❤️ by **Akmal Khan**
> GitHub: [@Akmalkhan0](https://github.com/Akmalkhan0)
> LinkedIn: [Akmal Khan](https://linkedin.com/in/your-profile)
