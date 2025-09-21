"use client"

import { useEffect, useState } from "react"

export interface Election {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: "NOT_STARTED" | "VOTING_OPEN" | "VOTING_CLOSED" | "COUNTING" | "COMPLETED" | "CANCELLED" | "DISPUTED";
    createdAt: string;
    candidates: Candidate[]; // Candidate[] is an array of candidate objects
    hasVoted?: boolean;
}

export interface Candidate {
    id: string;
    name: string;
    // add other candidate fields if needed
}

export function useElectionDetails(token: string | null) {
    const [elections, setElections] = useState<Election[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("No token found");
            return;
        }

        // fetch(`http://localhost:8080/api/v1/election/getAll`, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        //     credentials: "include",
        // })
        //     .then((res) => {
        //         if (!res.ok) throw new Error("Failed to fetch election details");
        //         return res.json();
        //     })
        //     .then((data) => {
        //         setElections(Array.isArray(data.data) ? data.data : []);
        //         setLoading(false);
        //     })
        //     .catch((err) => {
        //         setError(err.message);
        //         setLoading(false);
        //     });
    }, [token]);

    return { elections, loading, error };
}