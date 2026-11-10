import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[db] MONGODB_URI not set: contact messages will not be stored.');
    return;
  }

  await mongoose
    .connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(({ connection }) => console.log(`[db] Connected to ${connection.host}`))
    .catch((err) =>
      console.warn(`[db] Connection failed, continuing without storage: ${err.message}`),
    );
};

export default connectDB;
