import { gql } from "@apollo/client";

export const GET_CURRENT_COMPANY = gql`
    query {
        company {
            id
            name
            address
            reportYears
        }
    }
`;