import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDR0lr5LsqGepeMnqoWErFLE_5tyC_mJjs",
  authDomain: "portfolio-53bf8.firebaseapp.com",
  projectId: "portfolio-53bf8",
  storageBucket: "portfolio-53bf8.firebasestorage.app",
  messagingSenderId: "509626883104",
  appId: "1:509626883104:web:b9cc6b045cadf525fa3045",
  measurementId: "G-PBE9MZCZL1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
