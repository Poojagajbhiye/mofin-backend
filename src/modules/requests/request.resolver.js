import { Request } from './request.model.js';
import { Expense } from '../expenses/expense.model.js';

export const requestResolvers = {
  Query: {
    getRequests: async (_, { status }, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');
      const filter = { parentId: user._id };
      if (status) filter.status = status;
      return Request.find(filter);
    },
    getMyRequests: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return Request.find({ userId: user._id });
    },
  },

  Mutation: {
    createRequest: async (_, { type, year, month, data }, { user }) => {
      if (!user || user.role !== 'member') throw new Error('Only sub-accounts can create requests');

      // Create request
      const request = new Request({
        type,
        userId: user._id,
        parentId: user.parentId,
        year,
        month,
        data
      });
      return request.save();
    },

    approveRequest: async (_, { requestId }, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');

      const request = await Request.findById(requestId);
      if (!request) throw new Error('Request not found');
      if (request.status !== 'pending') throw new Error('Request already processed');

      // Apply changes to Expenses
      let expense = await Expense.findOne({ userId: request.parentId, year: request.year });
      if (!expense) expense = new Expense({ userId: request.parentId, year: request.year, months: {} });

      const monthData = expense.months.get(request.month) || { income: 0, balance: 0, savings: [], investments: [], expenses: {} };

      if (request.type === 'expense') {
        monthData.expenses = { ...monthData.expenses, ...request.data };
      } else if (request.type === 'saving') {
        monthData.savings = [...monthData.savings, ...request.data];
      } else if (request.type === 'investment') {
        monthData.investments = [...monthData.investments, ...request.data];
      }

      expense.months.set(request.month, monthData);
      await expense.save();

      request.status = 'approved';
      await request.save();

      return request;
    },

    rejectRequest: async (_, { requestId }, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Not authorized');
      const request = await Request.findById(requestId);
      if (!request) throw new Error('Request not found');
      if (request.status !== 'pending') throw new Error('Request already processed');

      request.status = 'rejected';
      await request.save();
      return request;
    }
  }
};
