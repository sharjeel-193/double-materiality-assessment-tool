// graphql/stakeholder.ts
import { gql } from '@apollo/client';

export const GET_STAKEHOLDERS_BY_REPORT = gql`
    query getStakeholdersByReport($reportId: String!){
        stakeholdersByReport(reportId: $reportId){
            data {
                id
                name
                description
                activity {
                    id
                    name
                    type
                }
            }
            success
            message
        }
    }
`

export const CREATE_STAKEHOLDER = gql`
    mutation CreateStakeholder($createStakeholderInput: CreateStakeholderInput!) {
        createStakeholder(createStakeholderInput: $createStakeholderInput) {
            data {
                id
                name
                description
                activityId
                activity {
                    id
                    name
                    type
                }
            }
            success
            message
        }
    }
`

export const UPDATE_STAKEHOLDER = gql`
    mutation updateStakeholder($id: String!, $updateStakeholderInput: UpdateStakeholderInput!){
        updateStakeholder(id: $id, updateStakeholderInput:$updateStakeholderInput){
            data {
                id
                name
                description
                activityId
            }
            success
            message
        }
    }
`

export const DELETE_STAKEHOLDER = gql`
    mutation DeleteStakeholder($id: String!){
        removeStakeholder(id: $id){
            data {
                id
                name
            }
            success
            message
        }
    }
`;