// graphql/queries.ts
import { gql } from '@apollo/client';

export const GET_REPORT_BY_YEAR = gql`
    query GetReportByYear($companyId: String!, $year: Float!) {
        reportByYear(companyId: $companyId, year: $year) {
            id
            year
            companyId
            standardId
            totalTopics
            materialTopics
            totalImpacts
            materialImpacts
            createdAt
            updatedAt
            context {
                id
            }
        }
    }
`;

export const CREATE_REPORT = gql`
    mutation CreateReport($createReportInput: CreateReportInput!) {
        createReport(createReportInput: $createReportInput) {
            id
            year
            companyId
            totalTopics
            materialTopics
            totalImpacts
            materialImpacts
            createdAt
            updatedAt
        }
    }
`;


