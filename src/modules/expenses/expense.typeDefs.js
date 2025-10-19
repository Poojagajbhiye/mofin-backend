import { gql } from 'apollo-server-express';

export const expenseTypeDefs = gql`
  type Saving {
    type: String!
    amount: Float!
  }

  type Investment {
    type: String!
    amount: Float!
  }

  type ExpenseDetail {
    budget: Float
    actual: Float
  }

  type Month {
    income: Float
    balance: Float
    savings: [Saving]
    investments: [Investment]
    expenses: JSON
  }

  scalar JSON

  type Expense {
    id: ID!
    userId: ID!
    year: Int!
    months: JSON
  }

  type Query {
    getExpenses(userId: ID!, year: Int!): Expense
  }

  type Mutation {
    addOrUpdateMonth(
      userId: ID!
      year: Int!
      month: String!
      income: Float
      balance: Float
      savings: [SavingInput]
      investments: [InvestmentInput]
      expenses: JSON
    ): Expense
  }

  input SavingInput {
    type: String!
    amount: Float!
  }

  input InvestmentInput {
    type: String!
    amount: Float!
  }
`;
