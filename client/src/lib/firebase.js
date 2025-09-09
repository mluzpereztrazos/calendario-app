// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyC6eBof3bu75EUT6a3n3jJP8MD3XAN8hno",
  authDomain: "calendar-me-c76c8.firebaseapp.com",
  projectId: "calendar-me-c76c8",
  storageBucket: "calendar-me-c76c8.firebasestorage.app",
  messagingSenderId: "411578449007",
  appId: "1:411578449007:web:69ba3c6e127e25e49ba19a",
  measurementId: "G-RF01LYGK28"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();