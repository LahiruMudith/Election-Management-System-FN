// Raw object exactly as your backend returns it.
export interface CandidateApi {
    id: number;
    electionId: number | null;
    partyId: number | null;
    fullName: string;
    age: number;
    profession: string;
    manifesto: string | null;
    createdAt: string;          // e.g. "2025-09-13T07:06:34.281+00:00"
    nicFrontImg: string;
    nicBackImg: string;
    selfieImg: string;
    active: boolean;
    approved: boolean;
}

// UI status type derived from approved + active
export type CandidateStatus = "PENDING" | "APPROVED" | "REJECTED";

// Enriched / normalized model for the frontend
export interface Candidate {
    id: number;
    electionId: number | null;
    partyId: number | null;

    fullName: string;
    age: number;
    profession: string;
    manifesto: string | null;

    // Images
    nicFrontImg: string;
    nicBackImg: string;
    selfieImg: string;

    // Backend flags (normalized)
    approved: boolean;
    active: boolean;

    // Derived
    status: CandidateStatus;

    createdAt: string;          // Keep raw string; format in UI

    // Optional enrichable fields (if you later fetch more)
    partyName?: string;
    district?: string;
    phoneNumber?: string;
    symbolUrl?: string;
    manifestoUrl?: string;
    votesCount?: number;
}

export function deriveCandidateStatus(approved: boolean, active: boolean): CandidateStatus {
    if (approved && active) return "APPROVED";
    if (!approved && active) return "PENDING";
    return "REJECTED"; // active === false OR any rule you define
}

export function mapCandidateApi(api: CandidateApi): Candidate {
    return {
        id: api.id,
        electionId: api.electionId,
        partyId: api.partyId,
        fullName: api.fullName,
        age: api.age,
        profession: api.profession,
        manifesto: api.manifesto,
        nicFrontImg: api.nicFrontImg,
        nicBackImg: api.nicBackImg,
        selfieImg: api.selfieImg,
        approved: api.approved,
        active: api.active,
        status: deriveCandidateStatus(api.approved, api.active),
        createdAt: api.createdAt,
    };
}

export function mapCandidateList(apiList: CandidateApi[]): Candidate[] {
    return apiList.map(mapCandidateApi);
}