// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmCIyESkv7RtsuQwTNtYGV2ZQZ6fqvw4Y",
  authDomain: "live-chat-app-6724e.firebaseapp.com",
  projectId: "live-chat-app-6724e",
  storageBucket: "live-chat-app-6724e.firebasestorage.app",
  messagingSenderId: "1014418717987",
  appId: "1:1014418717987:web:d4f557d661182594eaa096"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export db so it can be used in Chat.jsx
export { db };
