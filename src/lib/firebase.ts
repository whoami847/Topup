// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBv3OaOnDC52ePuX9fOcqdPBcX05GXLuIA",
  authDomain: "test1-0-75379.firebaseapp.com",
  projectId: "test1-0-75379",
  storageBucket: "test1-0-75379.firebasestorage.app",
  messagingSenderId: "70903626597",
  appId: "1:70903626597:web:94b9c069c5dab219703f8c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
