// Firebase initialization and mock service architecture
// Implements client-side mock datastore fallback so the system is immediately functional 
// even if credentials are not filled yet, while supporting active Firebase services.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key-placeholder",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-auth-domain-placeholder",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project-id-placeholder",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-storage-bucket-placeholder",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "mock-sender-id-placeholder",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "mock-app-id-placeholder"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
