import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
    mutation Login($loginInput: LoginInput!) {
        login(loginInput: $loginInput) {
            accessToken
        }
    }
`;

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        me {
            id
            name
            email
            role
            companyId
            company {
                id
                name
            }
        }
    }
`;

export const CREATE_USER_MUTATION = gql`
    mutation CreateUser($createUserInput: CreateUserInput!) {
        createUser(createUserInput: $createUserInput) {
            id
            name
            email
            role
            companyId
        }
    }
`;
