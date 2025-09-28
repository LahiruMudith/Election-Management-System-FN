"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useVoterDetails } from "@/hooks/getVoterDetails";

export default function VoterRedirect() {
    const router = useRouter();
    const token = Cookies.get("token") ?? null;
    const username = Cookies.get("username") ?? null;
    const { voterProfile, loading, error } = useVoterDetails(token, username);

    useEffect(() => {
        if (loading || error) return;

        if (!voterProfile) {
            router.push("/verify");
            return;
        }
        router.push("/voter-dashboard");
    }, [voterProfile, loading, error, router]);

    // Loading, error, or blank state
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!voterProfile) return <div>No voter data</div>;

    // Optionally, return null since all cases are handled by redirect
    return(
        <div>Redirecting...</div>
    );
}