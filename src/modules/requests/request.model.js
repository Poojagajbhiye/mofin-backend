import mongoose from 'mongoose';

const { Schema } = mongoose;

const requestSchema = new Schema({
  type: { 
    type: String, 
    enum: ['expense', 'saving', 'investment'], 
    required: true 
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },   // sub-account who created
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // main account
  year: { type: Number, required: true },
  month: { type: String, required: true },
  data: { type: Schema.Types.Mixed, required: true }, // proposed changes
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
}, { timestamps: true });

export const Request = mongoose.model('Request', requestSchema);
