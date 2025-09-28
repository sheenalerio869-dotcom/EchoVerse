// Import the functions you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBOlaM_cDjwruQLEV3oxhIym9IvTlqkRtg",
  authDomain: "finalapp-9df8e.firebaseapp.com",
  projectId: "finalapp-9df8e",
  storageBucket: "finalapp-9df8e.firebasestorage.app",
  messagingSenderId: "557678823097",
  appId: "1:557678823097:web:d837a81d47a2fa96b53d68",
  measurementId: "G-JEN4D16P9R",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
