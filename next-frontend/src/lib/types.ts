export interface CompanyCharacteristics {
    companyName: string;
    date: string;
    businessLocation: string;
    businessType: string;
    legalForm: string;
    companySizeEmployees: string;
    companySizeRevenue: string;
    productSpectrum: string;
    customerSpectrum: string;
    supplyChainScope: string;
    materialSpectrum: string;
    specialFeatures: string;
    extraDetails: string;
}

export interface Activity {
    id: number;
    type: string;
    name: string;
    description: string;
}

export type ActivityType = 'Upstream' | 'Downstream';

export interface Stakeholder {
    id: number;
    name: string;
    contact: string;
    description: string;
}

export interface StakeholderRating {
    id: number
    influence: number; // 1-5 scale
    impact: number; // 1-5 scale
    name: string;
}

export interface TopicRating {
    id: number
    relevance: number; // 1-5 scale
    magnitude: number; // 1-5 scale
    name: string;
    dimension: string
}

export interface AnalystSubmission {
    [analystName: string]: StakeholderRating[];
}

export interface CSVColumn {
    label: string;
    dataType: 'string' | 'float' | 'integer';
}

