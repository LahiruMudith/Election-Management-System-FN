// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAjNblfiyLIPt54hPXNa1VnlgHfgwKpe9g",
    authDomain: "login-auth-a1a16.firebaseapp.com",
    projectId: "login-auth-a1a16",
    storageBucket: "login-auth-a1a16.firebasestorage.app",
    messagingSenderId: "857329968263",
    appId: "1:857329968263:web:e3b5022c93585f08624422"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export default app;