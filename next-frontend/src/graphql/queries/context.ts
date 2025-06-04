// graphql/context.queries.ts
import { gql } from '@apollo/client';

export const GET_CONTEXT_BY_REPORT = gql`
  query GetContextByReport($reportId: String!) {
    contextByReport(reportId: $reportId) {
      id
      location
      type
      form
      size_employees
      size_revenue
      customer_scope
      supply_chain_scope
      extra_details
      reportId
      createdAt
      updatedAt
    }
  }
`;


export const CREATE_CONTEXT = gql`
  mutation CreateContext($createContextInput: CreateContextInput!) {
    createContext(createContextInput: $createContextInput) {
      id
      location
      type
      form
      size_employees
      size_revenue
      customer_scope
      supply_chain_scope
      extra_details
      reportId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CONTEXT = gql`
  mutation UpdateContext($id: String!, $updateContextInput: UpdateContextInput!) {
    updateContext(id: $id, updateContextInput: $updateContextInput) {
      id
      location
      type
      form
      size_employees
      size_revenue
      customer_scope
      supply_chain_scope
      extra_details
      reportId
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CONTEXT = gql`
  mutation RemoveContext($id: String!) {
    removeContext(id: $id) {
      id
      location
      type
      form
      size_employees
      size_revenue
      customer_scope
      supply_chain_scope
      extra_details
      reportId
    }
  }
`;
