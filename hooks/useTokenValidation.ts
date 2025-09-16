import { useEffect, useMemo, useState } from "react";

type ApiResponse = {
    status: number;
    message?: string;
    data?: unknown;
};

type Result = {
    isValid: boolean | null;   // null = not checked yet
    loading: boolean;
    error: Error | null;
    validate: () => Promise<boolean>;
};

function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return undefined;
}

export function useTokenValidation(): Result {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const validate = useMemo(() => {
        return async () => {
            try {
                setLoading(true);
                setError(null);

                const token = getCookie("token");
                const username = getCookie("username");
                const role = getCookie("role");

                if (!token || !username || !role) {
                    setIsValid(false);
                    setError(new Error("Missing authentication cookies."));
                    return false;
                }

                const url = `http://localhost:8080/api/log/checkToken?token=${encodeURIComponent(token)}`;
                const res = await fetch(url, { method: "GET", credentials: "include" });

                // Expecting your ApiResponse { status, message, data }
                let ok = false;
                try {
                    const json = (await res.json()) as ApiResponse;
                    ok = json?.status === 200;
                    if (!ok && json?.message) {
                        setError(new Error(json.message));
                    }
                } catch {
                    // If response isn't JSON, fall back to HTTP status
                    ok = res.ok;
                    if (!ok) setError(new Error(`Token validation failed (${res.status}).`));
                }

                setIsValid(ok);
                return ok;
            } catch (e) {
                setError(e as Error);
                setIsValid(false);
                return false;
            } finally {
                setLoading(false);
            }
        };
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const result = await validate();
            if (!mounted) return;
            // isValid/loading already set inside validate
            return result;
        })();
        return () => {
            mounted = false;
        };
    }, [validate]);

    return { isValid, loading, error, validate };
}