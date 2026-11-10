import dns from 'node:dns';
import mongoose from 'mongoose';

dns.setDefaultResultOrder('ipv4first');
mongoose.set('bufferCommands', false);

const CONNECT_OPTIONS = { serverSelectionTimeoutMS: 5000, maxPoolSize: 5 };

let pending = null;
let warnedMissingUri = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    if (!warnedMissingUri) {
      console.warn('[db] MONGODB_URI not set: leaderboard and message storage are offline.');
      warnedMissingUri = true;
    }
    return false;
  }

  pending ??= mongoose
    .connect(uri, CONNECT_OPTIONS)
    .then(({ connection }) => console.log(`[db] Connected to ${connection.host}`))
    .catch((err) => {
      console.error(`[db] Connection failed: ${err.message}`);
      pending = null;
    });

  await pending;
  return mongoose.connection.readyState === 1;
};

export default connectDB;
