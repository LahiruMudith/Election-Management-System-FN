import { useEffect, useState, useCallback } from "react";
import { Candidate, CandidateApi, mapCandidateList } from "@/types/candidate";

interface ApiEnvelope<T> {
    status: number;
    message: string;
    data: T;
}

export function useGetAllCandidates(token: any) {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);

    const fetchAll = useCallback(async () => {
        if (!token) {
            setLoading(false);
            setError("No token found");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("http://localhost:8080/api/v1/candidate/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch candidate details (HTTP ${res.status})`);
            }

            const json: ApiEnvelope<CandidateApi[]> = await res.json();
            const list = Array.isArray(json.data) ? json.data : [];
            setCandidates(mapCandidateList(list));
            setLastFetchedAt(Date.now());
        } catch (e: any) {
            setError(e.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return {
        candidates,
        candidatesLoading: loading,
        candidatesError: error,
        lastFetchedAt,
        refetchCandidates: fetchAll,
    };
}