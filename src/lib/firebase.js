import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Public Firebase Configuration
// Vite environment variables with graceful fallback to the configured Firebase project
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyA2RaoAAIb3Iz_t1ix6Bf2ZB-_PS53FZaQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "football-jersey-a6f45.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://football-jersey-a6f45-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "football-jersey-a6f45",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "football-jersey-a6f45.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "596486974613",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:596486974613:web:6e6aac5ba6c6fa85297f9c"
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Realtime Database and Auth
export const db = getDatabase(app);
export const auth = getAuth(app);
export default app;
