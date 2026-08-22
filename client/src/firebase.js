// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "real-estate-mern-project-4ea5c.firebaseapp.com",
    projectId: "real-estate-mern-project-4ea5c",
    storageBucket: "real-estate-mern-project-4ea5c.firebasestorage.app",
    messagingSenderId: "827164637267",
    appId: "1:827164637267:web:535bc78cec0e8c8546eea6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);