import { gql } from '@apollo/client';

export const IMPACT_FIELDS = `
    id
    title
    description
    scale
    scope
    irremediability
    likelihood
    type
    orderOfEffect
    topicId
    reportId
    topic {
        id
        name
    }
`;

export const CREATE_IMPACT = gql`
    mutation CreateImpact($createImpactInput: CreateImpactInput!) {
        createImpact(createImpactInput: $createImpactInput) {
        success
        message
            data {
                ${IMPACT_FIELDS}
            }
        }
    }
`;

export const DELETE_IMPACT = gql`
    mutation RemoveImpact($id: ID!) {
        removeImpact(id: $id) {
        success
        message
            data {
                id
                title
            }
        }
    }
`;

export const GET_IMPACTS_BY_REPORT = gql`
    query ImpactsByReport($reportId: ID!) {
        impactsByReport(reportId: $reportId) {
            success
            message
            data {
                ${IMPACT_FIELDS}
            }
        }
    }
`;

export const FINANCIAL_EFFECT_FIELDS = `
    id
    title
    description
    likelihood
    magnitude
    type
    topicId
    reportId
    topic {
        id
        name
    }
`;

export const CREATE_FINANCIAL_EFFECT = gql`
    mutation CreateFinancialEffect($createFinancialEffectInput: CreateFinancialEffectInput!) {
        createFinancialEffect(createFinancialEffectInput: $createFinancialEffectInput) {
            success
            message
            data {
                ${FINANCIAL_EFFECT_FIELDS}
            }
        }
    }
`;

export const DELETE_FINANCIAL_EFFECT = gql`
    mutation RemoveFinancialEffect($id: ID!) {
        removeFinancialEffect(id: $id) {
        success
        message
            data {
                id
                title
            }
        }
    }
`;

export const GET_FINANCIAL_EFFECTS_BY_REPORT = gql`
    query FinancialEffectsByReport($reportId: ID!) {
        financialEffectsByReport(reportId: $reportId) {
            success
            message
            data {
                ${FINANCIAL_EFFECT_FIELDS}
            }
        }
    }
`;

export const GET_FINANCIAL_EFFECTS_BY_REPORT_AND_TYPE = gql`
    query FinancialEffectsByReportAndType($reportId: ID!, $type: FinancialType!) {
        financialEffectsByReportAndType(reportId: $reportId, type: $type) {
        success
        message
            data {
                ${FINANCIAL_EFFECT_FIELDS}
            }
        }
    }
`;

