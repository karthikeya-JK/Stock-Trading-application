import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let useMock = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/sb-stocks';
  
  try {
    // Attempt Mongoose connection
    console.log(`Connecting to MongoDB at ${mongoURI}...`);
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // Timeout quickly if MongoDB is not running
    });
    console.log('MongoDB database connected successfully.');
    useMock = false;
  } catch (error) {
    console.warn('\n⚠️  MongoDB connection failed:', error.message);
    console.warn('🔄 Falling back to local JSON-based mock database storage (under server/data/).\n');
    useMock = true;
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }
};

export const isMockDatabase = () => useMock;
export default connectDB;
