import { Context } from './context'

export interface Report {
    id: string;
    year: number;
    companyId: string;
    standardId: string;
    totalStakeholders: number;
    importantStakeholders: number;
    totalTopics: number;
    materialTopics: number;
    totalImpacts: number;
    totalFinancialEffects: number;
    impactRadar?: string; // JSON string
    financialRadar?: string; // JSON string
    summary?: string; // JSON string
    topStakeholders?: string; // JSON string
    topTopics?: string; // JSON string
    status: number;
    createdAt: string;
    updatedAt: string;
    context?: Context;
    standard: {id: string, name: string}
}

export interface updateReportInput {
    status?: number
}

