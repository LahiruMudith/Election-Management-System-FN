export interface PartyApi {
    id: number;
    name: string;
    description: string;
    symbol: string;
    color: string;
    leaderName: string;
    founderYear: number;
    active: boolean;
}

// Raw object exactly as your backend returns it.
export interface CandidateApi {
    id: number;
    electionId: number | null;
    userId: number | null;
    partyId: PartyApi | null; // <-- FIXED
    fullName: string;
    age: number;
    profession: string;
    manifesto: string | null;
    createdAt: string;
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
    userId: number | null;
    partyName?: string;
    partyLeaderName?: string;
    partySymbol?: string;
    fullName: string;
    age: number;
    profession: string;
    manifesto: string | null;
    nicFrontImg: string;
    nicBackImg: string;
    selfieImg: string;
    approved: boolean;
    active: boolean;
    status?: CandidateStatus ;
    createdAt: string;
    // ...other enrichable fields
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
        partyId: api.partyId ? api.partyId.id : null,
        userId: api.userId,
        partyName: api.partyId ? api.partyId.name : undefined,
        partyLeaderName: api.partyId ? api.partyId.leaderName : undefined,
        partySymbol: api.partyId ? api.partyId.symbol : undefined,
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