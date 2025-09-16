import { useCallback, useEffect, useRef, useState } from "react";

export type VoterImages = {
    nicFrontUrl?: string;
    nicBackUrl?: string;
    selfieUrl?: string;
};

type Result = {
    images: VoterImages;
    loading: boolean;
    error: string | null;
    reload: () => Promise<void>;
};

async function fetchImageAsObjectUrl(
    url: string,
    token?: string | null
): Promise<string | undefined> {
    const res = await fetch(url, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        credentials: "include",
    });

    if (res.status === 404) return undefined; // image not found
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);

    const blob = await res.blob();
    return URL.createObjectURL(blob);
}

/**
 * Fetches NIC front, NIC back, and selfie images for a given NIC number.
 * Returns blob URLs suitable for <img src={...}> and revokes them on cleanup.
 */
export function useVoterImages(
    nic: string | null | undefined,
    token?: string | null,
    baseUrl = "http://localhost:8080/api/v1/voter/images"
): Result {
    const [images, setImages] = useState<VoterImages>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Track created object URLs to revoke later
    const currentUrlsRef = useRef<string[]>([]);

    const clearObjectUrls = useCallback(() => {
        for (const url of currentUrlsRef.current) {
            try {
                URL.revokeObjectURL(url);
            } catch {
                // ignore
            }
        }
        currentUrlsRef.current = [];
    }, []);

    const reload = useCallback(async () => {
        if (!nic) {
            setImages({});
            setLoading(false);
            setError("No NIC provided");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Build endpoints using NIC (not username)
            const nicEncoded = encodeURIComponent(nic);
            const frontEndpoint = `${baseUrl}/${nicEncoded}/nic/front`;
            const backEndpoint = `${baseUrl}/${nicEncoded}/nic/back`;
            const selfieEndpoint = `${baseUrl}/${nicEncoded}/selfie`;

            // Fetch all three in parallel
            const [frontUrl, backUrl, selfieUrl] = await Promise.all([
                fetchImageAsObjectUrl(frontEndpoint, token).catch(() => undefined),
                fetchImageAsObjectUrl(backEndpoint, token).catch(() => undefined),
                fetchImageAsObjectUrl(selfieEndpoint, token).catch(() => undefined),
            ]);

            // Revoke old URLs then store new ones
            clearObjectUrls();
            const urls: string[] = [];
            if (frontUrl) urls.push(frontUrl);
            if (backUrl) urls.push(backUrl);
            if (selfieUrl) urls.push(selfieUrl);
            currentUrlsRef.current = urls;

            setImages({ nicFrontUrl: frontUrl, nicBackUrl: backUrl, selfieUrl });
        } catch (e: any) {
            setError(e?.message ?? "Failed to load images");
            setImages({});
        } finally {
            setLoading(false);
        }
    }, [nic, token, baseUrl, clearObjectUrls]);

    useEffect(() => {
        void reload();
        return () => {
            clearObjectUrls();
        };
    }, [reload, clearObjectUrls]);

    return { images, loading, error, reload };
}