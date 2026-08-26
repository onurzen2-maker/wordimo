import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBd6n7hAPfyWvo_fMEKaNBZi2RgvKjK8nc",
  authDomain: "wordimoweb.firebaseapp.com",
  projectId: "wordimoweb",
  storageBucket: "wordimoweb.firebasestorage.app",
  messagingSenderId: "613816800230",
  appId: "1:613816800230:web:89830665044ffd8a3f7c27"
};

// Firebase'i Başlat
const app = initializeApp(firebaseConfig);

// Veritabanını (Firestore) Dışa Aktar
export const db = getFirestore(app);
