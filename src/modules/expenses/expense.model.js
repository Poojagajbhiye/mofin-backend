import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  months: {
    type: Map,
    of: new mongoose.Schema({
      income: { type: Number, default: 0 },
      balance: { type: Number, default: 0 },
      savings: [
        { type: { type: String }, amount: { type: Number, default: 0 } }
      ],
      investments: [
        { type: { type: String }, amount: { type: Number, default: 0 } }
      ],
      expenses: { type: Map, of: new mongoose.Schema({
        budget: { type: Number, default: 0 },
        actual: { type: Number, default: 0 }
      }) }
    }, { _id: false })
  }
}, { timestamps: true });

export const Expense = mongoose.model('Expense', expenseSchema);
