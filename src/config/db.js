// src/config/db.js
import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
  if (!mongoUri) {
    console.warn('MONGO_URI not provided — skipping DB connection (run MongoDB Atlas setup next).');
    return null;
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    return mongoose;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}
