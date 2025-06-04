// graphql/activity.queries.ts
import { gql } from '@apollo/client';

export const GET_ACTIVITIES_BY_CONTEXT = gql`
  query GetActivitiesByContext($contextId: String!) {
    activitiesByContext(contextId: $contextId) {
      id
      name
      description
      type
      contextId
    }
  }
`;

export const GET_ACTIVITY = gql`
  query GetActivity($id: String!) {
    activity(id: $id) {
      id
      name
      description
      type
      contextId
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_ACTIVITIES = gql`
  query GetAllActivities {
    activities {
      id
      name
      description
      type
      contextId
      createdAt
      updatedAt
    }
  }
`;

// graphql/activity.queries.ts (continued)

export const CREATE_ACTIVITY = gql`
  mutation CreateActivity($createActivityInput: CreateActivityInput!) {
    createActivity(createActivityInput: $createActivityInput) {
      id
      name
      description
      type
      contextId
    }
  }
`;

export const UPDATE_ACTIVITY = gql`
  mutation UpdateActivity($id: String!, $updateActivityInput: UpdateActivityInput!) {
    updateActivity(id: $id, updateActivityInput: $updateActivityInput) {
      id
      name
      description
      type
      contextId
    }
  }
`;

export const DELETE_ACTIVITY = gql`
  mutation RemoveActivity($id: String!) {
    removeActivity(id: $id) {
      id
      name
      type
      contextId
    }
  }
`;

export const GET_ACTIVITIES_LABELS = gql `
  query GetActivitiesByContext($contextId: String!) {
    activitiesByContext(contextId: $contextId) {
      id
      name
      type
    }
  }
`
