import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorge } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: process.env.NEXT_APP_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_APP_FIREBASE_DOMAIN,
    projectId: "next-chat-app-89891",
    storageBucket: "next-chat-app-89891.appspot.com",
    messagingSenderId: "916868416986",
    appId: process.env.NEXT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorge(app); 
export const db = getFirestore(app);