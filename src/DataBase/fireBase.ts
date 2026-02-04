import { initializeApp,getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = { 
  apiKey: "AIzaSyBka61cFEB4-T5ictuxGDhJ1K1ebEhj4iA",
  authDomain: "authentication-6f0d8.firebaseapp.com",
  projectId: "authentication-6f0d8",
  storageBucket: "authentication-6f0d8.firebasestorage.app",
  messagingSenderId: "973239950010",
  appId: "1:973239950010:web:125acc4bc7f66939328083",
  measurementId: "G-LLMMXYX0WB"
};


const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const database = getDatabase(app);