import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cached: any = (global as any & typeof globalThis).mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000, 
      socketTimeoutMS: 45000 
    };

    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI is not defined');
    }
    
    cached.promise = await mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    }).catch((error: any) => {
      console.error('MongoDB connection error:', error);
      throw new Error('MongoDB connection failed');
    });
  }

  
  return cached.conn;
}