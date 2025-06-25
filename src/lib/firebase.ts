// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAo3CpsgHaRIv-7rDsCLlQnDbB0G3eSDY",
  authDomain: "test0-54fd7.firebaseapp.com",
  projectId: "test0-54fd7",
  storageBucket: "test0-54fd7.appspot.com",
  messagingSenderId: "353347728154",
  appId: "1:353347728154:web:d315ff9315eb37898b72a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);