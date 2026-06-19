import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase(mongoUri: string) {
  if (isConnected) {
    return mongoose.connection;
  }

  await mongoose.connect(mongoUri);
  isConnected = true;
  return mongoose.connection;
}
