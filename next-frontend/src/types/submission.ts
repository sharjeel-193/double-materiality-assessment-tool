import { Stakeholder } from "./stakeholder";
import { Topic } from "./topics";

export type SubmissionType = 'INTERNAL' | 'STAKEHOLDER';
export type TopicRatingType = 'FINANCIAL' | 'IMPACT'

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

export interface UserSubmissionGroupedData {
    [submissionId: string]: {
        userName: string;
        userId: string;
        stakeholderRatings: StakeholderRating[];
    };
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

export interface StakeholderSubmission {
    id: string;
    stakeholderId: string;
    reportId: string;
    stakeholder: {
        id: string;
        name: string;
    }
    type: SubmissionType;
    createdAt: string;     // ISO date string
    updatedAt: string;     // ISO date string
    topicRatings: TopicRating[]
}

export interface CreateTopicRatingInput {
    topicId: string;
    magnitude: number,
    relevance: number,
    ratingType: TopicRatingType
    score?: number
}

/** Payload for creating a new user submission */
export interface CreateStakeholderSubmissionInput {
    stakeholderId?: string;
    reportId: string;
    type: SubmissionType;
    topicRatings: CreateTopicRatingInput[]
}

export interface TopicRating {
    id: string,
    topicId: string,
    topic?: Topic,
    submissionId: string,
    ratingType: TopicRatingType,
    magnitude: number,
    relevance: number,
    score?: number
}

export type StakeholderSubmissionGroupedData = {
    [submissionId: string]: {
        stakeholderId: string;
        stakeholderName: string;
        topicRatings: TopicRating[];
    };
};

export interface MaterialityMatrixItem {
    topicId: string;
    topicName: string;
    impactScore: number;
    financialScore: number;
    impactRatingsCount: number;
    financialRatingsCount: number;
}