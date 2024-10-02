// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxLvUcNT5GLBvUdbXanfuFaFpsa15nE7E",
  authDomain: "air-quality-54.firebaseapp.com",
  projectId: "air-quality-54",
  storageBucket: "air-quality-54.appspot.com",
  messagingSenderId: 743312256310,
  appId: "1:743312256310:web:619053e0bf92300e969797",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
