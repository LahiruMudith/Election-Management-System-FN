// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";

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
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        const user = result.user;
        const email = user.email;
        const username = user.displayName;
        const password = generatePassword();

        // Send user data to backend
        fetch("http://localhost:8080/api/log/loginWithGoogle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
            credentials: "include",
        })
            .then(async (res) => {
                const text = await res.text();
                try {
                    return JSON.parse(text);
                } catch {
                    throw new Error("Invalid JSON from backend: " + text);
                }
            })
            .then((data) => {
                console.log(data);

                Cookies.set("role", data.data.role);
                Cookies.set("token", data.data.accessToken);
                Cookies.set("username", data.data.username);

                alert(data.message);
                if (data.status === 200) {
                    window.location.href = "/dashboard";
                } else {
                    console.log("Error:", data.message);
                }
            })
            .catch((error) => {
                console.log("Error:", error);
                alert("Login failed: " + error.message);
            });
    }).catch((error) => {
        console.log(error);
    });
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