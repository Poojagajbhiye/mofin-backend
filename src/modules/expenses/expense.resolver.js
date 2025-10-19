import { Expense } from './expense.model.js';

export const expenseResolvers = {
  Query: {
    getExpenses: async (_, { userId, year }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      // Members can only access their own data
      if (user.role !== 'admin' && user._id.toString() !== userId) {
        throw new Error('Not authorized');
      }

      return await Expense.findOne({ userId, year });
    },
  },
  Mutation: {
    addOrUpdateMonth: async (_, { userId, year, month, income, balance, savings, investments, expenses }, { user }) => {
      if (!user) throw new Error('Not authenticated');

      // Only admin or the owner can modify
      if (user.role !== 'admin' && user._id.toString() !== userId) {
        throw new Error('Not authorized');
      }

      let record = await Expense.findOne({ userId, year });
      if (!record) {
        record = new Expense({ userId, year, months: {} });
      }

      record.months.set(month, { income, balance, savings, investments, expenses });
      await record.save();
      return record;
    },
  },
};
