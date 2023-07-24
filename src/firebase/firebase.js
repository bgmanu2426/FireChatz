import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyA8e57MngvrGi5dXbXOXmkVodNhJ0_tw84",
    authDomain: "next-chat-app-89891.firebaseapp.com",
    projectId: "next-chat-app-89891",
    storageBucket: "next-chat-app-89891.appspot.com",
    messagingSenderId: "916868416986",
    appId: "916868416986:web:9f58274f5546c471306ce3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app); 
export const db = getFirestore(app);