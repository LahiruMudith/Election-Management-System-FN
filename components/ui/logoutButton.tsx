"use client"

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Remove your authentication cookies
        Cookies.remove("token");
        Cookies.remove("username");
        Cookies.remove("role");
        // Add more cookies if you use them

        // Optionally, clear localStorage/sessionStorage if used
        // localStorage.clear();
        // sessionStorage.clear();

        // Redirect to login page (or home)
        router.push("/"); // Change "/login" to your login route
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
            Logout
        </button>
    );
}