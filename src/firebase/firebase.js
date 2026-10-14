import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Fallback configuration supplied in specifications
const defaultFirebaseConfig = {
  apiKey: "AIzaSyA2RaoAAIb3Iz_t1ix6Bf2ZB-_PS53FZaQ",
  authDomain: "football-jersey-a6f45.firebaseapp.com",
  databaseURL: "https://football-jersey-a6f45-default-rtdb.firebaseio.com",
  projectId: "football-jersey-a6f45",
  storageBucket: "football-jersey-a6f45.firebasestorage.app",
  messagingSenderId: "596486974613",
  appId: "1:596486974613:web:6e6aac5ba6c6fa85297f9c"
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || defaultFirebaseConfig.databaseURL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId
};

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth & Realtime Database
export const auth = getAuth(app);
export const database = getDatabase(app);
export default app;
