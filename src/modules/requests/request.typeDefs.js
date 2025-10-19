import { gql } from 'apollo-server-express';

export const requestTypeDefs = gql`
  scalar JSON

  type Request {
    id: ID!
    type: String!
    userId: ID!
    parentId: ID!
    year: Int!
    month: String!
    data: JSON!
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getRequests(status: String): [Request!]! # admin only
    getMyRequests: [Request!]! # sub-account only
  }

  type Mutation {
    createRequest(type: String!, year: Int!, month: String!, data: JSON!): Request! # sub-account
    approveRequest(requestId: ID!): Request! # admin only
    rejectRequest(requestId: ID!): Request!  # admin only
  }
`;
