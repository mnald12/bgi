// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyAssGvNhblbuqW0RGfXMxvQAb98f7kN4XM",
  authDomain: "bgi-electrical-74ff4.firebaseapp.com",
  projectId: "bgi-electrical-74ff4",
  storageBucket: "bgi-electrical-74ff4.appspot.com",
  messagingSenderId: "691449798657",
  appId: "1:691449798657:web:586ac842a379c78a9ae000",
  measurementId: "G-N79YN7GEQ7",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCdat-rXkzHXYjtz6NqLUHPG4JZnSjvJYo",
//   authDomain: "bgi-electrical.firebaseapp.com",
//   projectId: "bgi-electrical",
//   storageBucket: "bgi-electrical.appspot.com",
//   messagingSenderId: "1090887408840",
//   appId: "1:1090887408840:web:f3c6c1eb7a02ba4add19fd",
//   measurementId: "G-RSSLLSHKN3",
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDDiFvHHGRxTmvTZEGYYzp3XW0HKbyhdBY",
//   authDomain: "bgi-store-e4db3.firebaseapp.com",
//   projectId: "bgi-store-e4db3",
//   storageBucket: "bgi-store-e4db3.appspot.com",
//   messagingSenderId: "624306370772",
//   appId: "1:624306370772:web:16c66b3fb9a6489b80a341",
//   measurementId: "G-JXBR0XE2RB",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };
