import mongoose from 'mongoose';

const { Schema } = mongoose;

const expenseSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  year: { type: Number, required: true },
  months: {
    type: Map,
    of: new Schema({
      income: { type: Number, default: 0 },
      balance: { type: Number, default: 0 },
      savings: [
        { type: { type: String }, amount: { type: Number, default: 0 } }
      ],
      investments: [
        { type: { type: String }, amount: { type: Number, default: 0 } }
      ],
      expenses: { type: Schema.Types.Mixed } // <- plain object now
    }, { _id: false })
  }
}, { timestamps: true });

export const Expense = mongoose.model('Expense', expenseSchema);
