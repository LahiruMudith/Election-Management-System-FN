import { useState, useEffect, useCallback } from "react";

export type VoterImages = {
    nicFrontUrl?: string;
    nicBackUrl?: string;
    selfieUrl?: string;
};

type Result = {
    images: VoterImages;
    loading: boolean;
    error: string | null;
    reload: () => void;
};

function isDirectImageUrl(url?: string) {
    return !!url && url.startsWith("http");
}

export function useVoterImages(
    nicFrontUrl?: string,
    nicBackUrl?: string,
    selfieUrl?: string,
    token?: string | null
): Result {
    const [images, setImages] = useState<VoterImages>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Memoized reload function
    const reload = useCallback(() => {
        setLoading(true);
        setError(null);

        setImages({
            nicFrontUrl: isDirectImageUrl(nicFrontUrl) ? nicFrontUrl : undefined,
            nicBackUrl: isDirectImageUrl(nicBackUrl) ? nicBackUrl : undefined,
            selfieUrl: isDirectImageUrl(selfieUrl) ? selfieUrl : undefined,
        });

        setLoading(false);
    }, [nicFrontUrl, nicBackUrl, selfieUrl]);

    useEffect(() => {
        reload();
        // Do NOT put 'reload' in dependency array, only its inputs
    }, [nicFrontUrl, nicBackUrl, selfieUrl]);

    console.log("fornt", nicFrontUrl);
    console.log("back", nicBackUrl);
    console.log("selfie", selfieUrl);

    return { images, loading, error, reload };
}