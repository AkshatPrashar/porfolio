import mongoose from 'mongoose';
import dns from 'dns'; // ADD THIS

dns.setDefaultResultOrder('ipv4first');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('[db] Using existing database connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.warn('[db] MONGODB_URI not provided, skipping connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log(`[db] Connected to ${db.connection.host}`);
  } catch (error) {
    console.error('[db] Connection failed:', error.message);
  }
};

export default connectDB;