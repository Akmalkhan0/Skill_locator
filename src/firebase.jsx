// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClwJ2_ze1TyPqfipNEaCU5oK4T6nZ3xls",
  authDomain: "skill-locator.firebaseapp.com",
  projectId: "skill-locator",
  storageBucket: "skill-locator.firebasestorage.app",
  messagingSenderId: "854094033758",
  appId: "1:854094033758:web:2f4d5ebf0d6dfee92895cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export default app;
