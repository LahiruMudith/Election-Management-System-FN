import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    UserCredential
} from "firebase/auth";
import Cookies from "js-cookie";

// Firebase configuration
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
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Detect mobile device
function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Function to generate a random password
function generatePassword(length = 12) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Main Google Sign-In function
export const signInWithGoogle = () => {
    if (isMobile()) {
        // Mobile: Use redirect (no then/catch here)
        signInWithRedirect(auth, provider);
    } else {
        // Desktop: Use popup
        signInWithPopup(auth, provider)
            .then(result => handleGoogleResult(result))
            .catch(error => {
                console.log(error);
                alert("Google Sign-In failed: " + error.message);
            });
    }
};

// Helper function for both popup and redirect
async function handleGoogleResult(result : UserCredential | null | undefined) {
    if (!result) return;
    const user = result.user;
    const email = user.email;
    const username = user.displayName;
    const password = generatePassword();

    try {
        const res = await fetch("http://localhost:8080/api/log/loginWithGoogle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
            credentials: "include",
        });
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error("Invalid JSON from backend: " + text);
        }

        Cookies.set("role", data.data.role);
        Cookies.set("token", data.data.accessToken);
        Cookies.set("username", data.data.username);

        alert(data.message);
        if (data.status === 200) {
            window.location.href = `/voter-dashboard`;
        } else {
            console.log("Error:", data.message);
        }
    } catch (error) {
        console.log("Error:", error);
        alert("Login failed: " + (error as Error).message);
    }
}

// React hook to handle redirect result (call in your login page/component)
export function useGoogleRedirectHandler() {
    useEffect(() => {
        getRedirectResult(auth)
            .then(result => {
                if (result) handleGoogleResult(result);
            })
            .catch(error => {
                console.log("Google redirect sign-in failed:", error);
                // Optionally alert(error.message);
            });
    }, []);
}