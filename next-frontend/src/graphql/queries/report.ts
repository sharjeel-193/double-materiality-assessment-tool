// graphql/queries/report.queries.ts
import { gql } from '@apollo/client';

export const REPORT_FIELDS = `
    id
    year
    companyId
    company {
        id
        name
    }
    standardId
    standard {
        id
        name
    }
    totalStakeholders
    importantStakeholders
    totalTopics
    materialTopics
    totalImpacts
    totalFinancialEffects
    impactRadar
    financialRadar
    summary
    topStakeholders
    topTopics
    status
    createdAt
    updatedAt
`;

export const GET_REPORT_BY_COMPANY_AND_YEAR = gql`
    query GetReportByCompanyAndYear($companyId: String!, $year: Float!) {
        reportByCompanyAndYear(companyId: $companyId, year: $year) {
            success
            message
            data {
                ${REPORT_FIELDS}
            }
        }
    }
`;

export const CREATE_REPORT = gql`
    mutation CreateReport($createReportInput: CreateReportInput!) {
        createReport(createReportInput: $createReportInput) {
            success
            message
            data {
                ${REPORT_FIELDS}
            }
        }
    }
`;

export const UPDATE_REPORT = gql`
    mutation UpdateReport($id: String!, $updateReportInput: UpdateReportInput!) {
        updateReport(id: $id, updateReportInput: $updateReportInput) {
            success
            message
            data {
                ${REPORT_FIELDS}
            }
        }
    } 
`;

export const UPDATE_REPORT_STATUS = gql`
    mutation UpdateReportStatus($id: String!, $status: Int!) {
        updateReport(id: $id, status: $status) {
            success
            message
            data {
                ${REPORT_FIELDS}
            }
        }
    } 
`;



