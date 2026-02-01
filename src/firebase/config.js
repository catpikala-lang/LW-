import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// তোমার দেওয়া অরিজিনাল Firebase কনফিগ
const firebaseConfig = {
  apiKey: "AIzaSyBy5psDsJWkdnuOv8SR_ip9jt-NjhlaHHo",
  authDomain: "leather-wallah.firebaseapp.com",
  projectId: "leather-wallah",
  storageBucket: "leather-wallah.firebasestorage.app",
  messagingSenderId: "503089778421",
  appId: "1:503089778421:web:dbb2f308fc2c1f38daffbc",
  measurementId: "G-B5V4VC1WM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// সার্ভিসগুলো এক্সপোর্ট করা হচ্ছে যাতে অন্য ফাইল থেকে ব্যবহার করা যায়
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;