// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdat-rXkzHXYjtz6NqLUHPG4JZnSjvJYo",
  authDomain: "bgi-electrical.firebaseapp.com",
  projectId: "bgi-electrical",
  storageBucket: "bgi-electrical.appspot.com",
  messagingSenderId: "1090887408840",
  appId: "1:1090887408840:web:f3c6c1eb7a02ba4add19fd",
  measurementId: "G-RSSLLSHKN3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };
