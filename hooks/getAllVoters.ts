import { useEffect, useState } from "react";

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
    nicFrontUrl?: string;  // URL to NIC Front image
    nicBackUrl?: string;   // URL to NIC Back image
    selfieUrl?: string;    // URL to Selfie image
}

export function useAllVoters(token: string | null) {
    const [voters, setVoters] = useState<Voter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("No token found");
            return;
        }

        fetch(`http://localhost:8080/api/v1/voter/getAll`, {
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
                setVoters(data.data); // assuming API returns { data: Voter[] }
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [token]);

    return { voters, loading, error };
}

export default useAllVoters;