import { gql } from '@apollo/client';

export const GET_TOPICS_BY_STANDARD = gql`
    query getTopicsByStandard($standardId: String!){
        topicsByStandard(standardId: $standardId){
            id
            name
            description
            dimension {
                id
                name
            }
        }
    }
`   