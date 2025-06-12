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
