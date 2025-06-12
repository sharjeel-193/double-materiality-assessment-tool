import { Stakeholder } from "./stakeholder";

export type SubmissionType = 'INTERNAL' | 'STAKEHOLDER';

/** Rating data for each stakeholder in a submission */
export interface StakeholderRating {
    id: string;
    submissionId: string;
    stakeholderId: string;
    influence: number;
    stakeholder?: Stakeholder
    impact: number;
    score?: number;
}

/** Represents one user submission with nested ratings */
export interface UserSubmission {
    id: string;
    userId: string;
    stakeholderId?: string;
    reportId: string;
    user: {
        id: string;
        name: string;
    }
    type: SubmissionType;
    createdAt: string;     // ISO date string
    updatedAt: string;     // ISO date string
    stakeholderRatings: StakeholderRating[];
}

export interface CreateStakeholderRatingInput {
    stakeholderId: string;
    stakeholder?: Stakeholder
    influence: number;
    impact: number;
    score?: number;
}

/** Payload for creating a new user submission */
export interface CreateUserSubmissionInput {
    userId?: string;
    stakeholderId?: string;
    reportId: string;
    type: SubmissionType;
    stakeholderRatings: CreateStakeholderRatingInput[];
}