// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOFn12ReCYTqeQbXgI_dMdUH4_6HSsC7Y",
    authDomain: "shivam-mart-a6b1e.firebaseapp.com",
    projectId: "shivam-mart-a6b1e",
    storageBucket: "shivam-mart-a6b1e.appspot.com",
    messagingSenderId: "1091426804395",
    appId: "1:1091426804395:web:5c3fc98cd427b735584dee",
    measurementId: "G-GR7BXN8WLD"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = () => signInWithPopup(auth, provider);

export { auth, provider as googleProvider, signInWithGoogle };
