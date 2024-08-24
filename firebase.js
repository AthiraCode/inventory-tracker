// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARUCJ9DdktVc1ETsXxQ5o9qxdwNGBJv9Q",
  authDomain: "inventory-management-f8539.firebaseapp.com",
  projectId: "inventory-management-f8539",
  storageBucket: "inventory-management-f8539.appspot.com",
  messagingSenderId: "616352683273",
  appId: "1:616352683273:web:dccf33897f5f866520efd8",
  measurementId: "G-4CZY19E6Q1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}