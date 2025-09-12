import { useEffect, useState } from "react";
import {cookies} from "next/headers";

export interface Voter {
    id: string;
    userId: string;
    nicNumber: string;
    phoneNumber: string;
    fullName: string;
    district: string;
    isActive: boolean;
    verified: string;
    createdAt: string;
}

export function useVoterDetails(token: string | null) {
    const [voter, setVoter] = useState<Voter | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("No token found");
            return;
        }

        fetch(`http://localhost:8080/api/v1/voter/get`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch voter details");
                return res.json();
            })
            .then((data) => {
                setVoter(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    return { voter, loading, error };
}