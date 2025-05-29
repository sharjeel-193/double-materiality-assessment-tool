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
    id: string
    impact_relevance: number; // 1-5 scale
    impact_magnitude: number; // 1-5 scale
    financial_relevance: number; // 1-5 scale
    financial_magnitude: number; // 1-5 scale
    topic: string;
    dimension: string,
    impact_score: number;
    financial_score: number
}

export interface StakeholderSubmission {
    [stakeholderName: string]: TopicRating[];
}

export interface AnalystSubmission {
    [analystName: string]: StakeholderRating[];
}

export interface CSVColumn {
    label: string;
    dataType: 'string' | 'float' | 'integer';
}

