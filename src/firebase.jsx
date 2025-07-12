// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "Api_Key",
  authDomain: "Auth_Domain",
  projectId: "Project_Id",
  storageBucket: "Storage_Adress",
  messagingSenderId: "Sender_Id",
  appId: "App_Id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export default app;
