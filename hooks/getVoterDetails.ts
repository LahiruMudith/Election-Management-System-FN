import { useEffect, useState } from "react";
import Cookies from "js-cookie";

// The profile structure, not just boolean
export interface VoterProfile {
    id: number;
    nicNumber: string;
    phoneNumber: string;
    fullName: string;
    district: string;
    verified: string;
    creatAt: string;
    nicFrontImg: string;
    nicBackImg: string;
    selfieImg: string;
    votes: any[];
    active: boolean;
}

// The user structure in your API
export interface VoterApiUser {
    id: number;
    email: string;
    username: string;
    password: string;
    role: string;
    createdAt: string;
    voterProfile: VoterProfile | null;
    candidates: any; // or null or correct type
    active: boolean;
}

export function useVoterDetails(token: string | null, username: string | null) {
    const [voterProfile, setVoterProfile] = useState<VoterProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("No token found");
            return;
        }
        if (!username) {
            setLoading(false);
            setError("No username found");
            return;
        }

        fetch(`http://localhost:8080/api/v1/get/${username}`, {
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
                // Defensive: voterProfile may be null
                setVoterProfile(data.data?.voterProfile ?? null);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [token, username]);

    return { voterProfile, loading, error };
}