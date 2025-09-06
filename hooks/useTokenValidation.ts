// hooks/useTokenValidation.ts
import { useEffect, useState } from "react";

export function useTokenValidation() {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [token, setToken] = useState<string | null>(null);

    function getCookie(name: string): string | undefined {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
    }

    useEffect(() => {
        const t = getCookie("token");
        setToken(t || null);

        if (t) {
            fetch(`http://localhost:8080/api/log/checkToken?token=${encodeURIComponent(t)}`, {
                method: "GET",
                credentials: "include",
            })
                .then((res) => res.json())
                .then((data) => setIsValid(data.status === 200))
                .catch(() => setIsValid(false));
        } else {
            setIsValid(false);
        }
    }, []);

    return { isValid, token };
}