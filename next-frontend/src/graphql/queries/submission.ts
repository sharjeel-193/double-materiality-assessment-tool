import { gql } from "@apollo/client";

export const CREATE_USER_SUBMISSION = gql`
    mutation CreateUserSubmission($createUserSubmissionInput: CreateUserSubmissionInput!) {
        createUserSubmission(createUserSubmissionInput: $createUserSubmissionInput) {
            success
            message
            data {
                id
                reportId
                user {
                    id
                    name
                }
                type
                createdAt
                updatedAt
                stakeholderRatings {
                    id
                    stakeholderId
                    influence
                    impact
                    score
                    stakeholder {
                        id
                        name
                    }
                }
            }
        }
  }
`;

export const GET_USER_SUBMISSIONS_BY_REPORT = gql`
    query GetUserSubmissionsByReport($reportId: String!){
        userSubmissionsByReport(reportId: $reportId){
            success
            message
            data{
                id
                type
                user {
                    id
                    name
                }
                stakeholderRatings {
                    stakeholder {
                        id
                        name
                    }
                    score
                    impact
                    influence
                }
            }
        }
    }
`

export const DELETE_USER_SUBMISSION = gql`
    mutation DeleteUserSubmission($id: String!) {
        removeUserSubmission(id: $id) {
            success
            message
            data {
                id
                userId
                type
            }
        }
    }
`;

export const GET_USERS_BY_COMPANY = gql`
    query FetchUsersByCompany($companyId: String!){
        usersByCompany(companyId: $companyId){
            success
            message
            data {
                id
                name
            }
        }
    }
`

// Add this to your GraphQL queries file
export const GET_USER_SUBMISSIONS_GROUPED_BY_REPORT = gql`
    query UserSubmissionsByReportGrouped($reportId: String!) {
        userSubmissionsByReportGrouped(reportId: $reportId) {
            success
            message
            data
        }
    }
`;

export const CREATE_STAKEHOLDER_SUBMISSION = gql`
    mutation CreateStakeholderSubmission($createStakeholderSubmissionInput: CreateStakeholderSubmissionInput!) {
        createStakeholderSubmission(createStakeholderSubmissionInput: $createStakeholderSubmissionInput) {
            success
            message
            data{
                id
                reportId
                stakeholder {
                    id
                    name
                }
                topicRatings {
                    id
                    topic {
                        id
                        name
                    }
                    ratingType
                    relevance
                    magnitude
                    score
                }
            }
        } 
    }
`;

export const DELETE_STAKEHOLDER_SUBMISSION = gql`
    mutation DeleteStakeholderSubmission($id: String!) {
        removeStakeholderSubmission(id: $id) {
            data {
                topicRatings {
                    ratingType
                }
            }
            success
            message
        }
    }
`;

export const GET_STAKEHOLDER_SUBMISSIONS_GROUPED_BY_REPORT = gql`
    query StakeholderSubmissionsByReportGrouped($reportId: String!) {
        stakeholderSubmissionsByReportGrouped(reportId: $reportId) {
            success
            message
            data
        }
    }
`;

export const GET_STAKEHOLDER_SUBMISSIONS_GROUPED_BY_REPORT_ANT_TYPE = gql`
    query StakeholderSubmissionsByReportAndRatingTypeGroupedGrouped($reportId: String!, $ratingType: TopicRatingType!) {
        stakeholderSubmissionsByReportAndRatingTypeGrouped(reportId: $reportId, ratingType: $ratingType) {
            success
            message
            data
        }
    }
`;

export const GET_STAKEHOLDERS_BY_REPORT_FOR_SUBMISSIONS = gql`
    query FetchStakeholdersByReport($reportId: String!){
        stakeholdersByReport(reportId: $reportId){
            success
            message
            data {
                id
                name
                avgImpact
                avgInfluence
            }
        }
    }
`

