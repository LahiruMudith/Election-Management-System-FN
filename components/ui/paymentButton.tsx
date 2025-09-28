import React, { useState } from "react";
import { CreditCard } from 'lucide-react';

// Make sure <script src="https://www.payhere.lk/lib/payhere.js"></script> is included in your index.html

function PayHereButton() {
    const [loading, setLoading] = useState(false);

    const handlePayNow = async () => {
        setLoading(true);
        const payload = {
            orderId: "ORDER123",
            itemName: "Test Product",
            amount: 1000.0,
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "0771234567",
            address: "Moronthuduwa",      // Optional: Add these if your backend expects them
            city: "Kaluthara",
            country: "Sri Lanka"
        };

        try {
            const response = await fetch("http://localhost:8080/api/log/payment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Payment init request failed!");
            const payment = await response.json();

            // Call PayHere SDK popup
            if (window.payhere) {
                window.payhere.startPayment(payment);
            } else {
                throw new Error("PayHere SDK not loaded. Make sure the script is in your index.html");
            }
        } catch (err) {
            let message = "Could not initiate payment.";
            if (err instanceof Error) {
                message += " " + err.message;
            } else if (typeof err === "string") {
                message += " " + err;
            }
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayNow}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-500 hover:to-blue-800 transition-all duration-200 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
            <CreditCard size={20} className="mr-2" />
            {loading ? "Processing..." : "Donate to Developer"}
        </button>
    );
}

export default PayHereButton;