import { Activity } from "./activity";

export interface Stakeholder {
    id: string;
    name: string;
    description?: string | null;
    activityId: string;
    activity?: Activity
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateStakeholderInput {
    name: string;
    description?: string;
    activityId: string;
}

export interface UpdateStakeholderInput {
    name?: string;
    description?: string;
    activityId?: string;
}

export interface StakeholderFormData {
    name: string;
    description?: string;
    activityId: string;
}