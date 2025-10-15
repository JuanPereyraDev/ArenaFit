// lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA-XMjRdNUJsT1Y3-S0BPdqEBt_scCu8Ls",
  authDomain: "gymapp-92410.firebaseapp.com",
  projectId: "gymapp-92410",
  storageBucket: "gymapp-92410.firebasestorage.app",
  messagingSenderId: "470574033135",
  appId: "1:470574033135:web:ff3762a8434bd1403ad31a",
  measurementId: "G-Y3ZGBHWKCY"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };