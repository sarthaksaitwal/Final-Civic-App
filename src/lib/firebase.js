import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCv3a7qadtc5I4K3zfzdWzd2tRynBsnJfU",
  authDomain: "city-89a1f.firebaseapp.com",
  databaseURL: "https://city-89a1f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "city-89a1f",
  storageBucket: "city-89a1f.firebasestorage.app",
  messagingSenderId: "498508813313",
  appId: "1:498508813313:web:4a5ef8ce42e81d05325c00",
  measurementId: "G-899FH4NFHB"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth and Realtime Database
const db = getFirestore(app);
const auth = getAuth(app);
const realtimeDb = getDatabase(app);

export { db, auth, realtimeDb };
