import { Topic } from './topics'

export type ImpactType = 'POSITIVE' | 'NEGATIVE'
export type OrderOfImpact = 'IMMEDIATE' | 'ENABLING' | 'STRUCTURAL'


export interface Impact {
    id: string;
    title: string;
    description: string;
    scale: number;
    scope: number;
    irremediability: number;
    likelihood: number;
    type: ImpactType;
    orderOfEffect: OrderOfImpact;
    topicId: string;
    reportId: string;
    topic?: Topic;
}

export interface CreateImpactInput {
    title: string;
    description: string;
    scale: number;
    scope: number;
    irremediability: number;
    likelihood: number;
    type: ImpactType;
    orderOfEffect: OrderOfImpact;
    topicId: string;
    reportId: string;
}

export type FinancialType = 'RISK' | 'OPPORTUNITY';

export interface FinancialEffect {
    id: string;
    title: string;
    description: string;
    likelihood: number;
    magnitude: number;
    type: FinancialType;
    topicId: string;
    reportId: string;
    topic?: Topic;
    report?: Report;
}

export interface CreateFinancialEffectInput {
    title: string;
    description: string;
    likelihood: number;
    magnitude: number;
    type: FinancialType;
    topicId: string;
    reportId: string;
}

