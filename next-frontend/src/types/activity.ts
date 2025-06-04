// types/activity.types.ts
export type ActivityType = 'UPSTREAM' | 'DOWNSTREAM';

export interface Activity {
    id: string;
    name: string;
    description?: string | null;
    type: ActivityType;
    contextId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ActivityLabel {
    id: string;
    name: string;
    type: ActivityType
}

export interface CreateActivityInput {
    name: string;
    description?: string;
    type: ActivityType;
    contextId: string;
}

export interface UpdateActivityInput {
    name?: string;
    description?: string;
    type?: ActivityType;
}

// Activity field configuration for forms
export interface ActivityFieldType {
    name: string;
    label: string;
    type: 'text' | 'select';
    options?: { value: string; label: string }[];
    multiline?: boolean;
    required?: boolean;
}

// Activity display helpers
export const ACTIVITY_TYPE_LABELS = {
    UPSTREAM: 'Upstream',
    DOWNSTREAM: 'Downstream'
} as const;

// For form validation
export interface ActivityFormData {
    name: string;
    description?: string;
    type: ActivityType;
}
