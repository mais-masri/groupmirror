import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set. Check backend/.env");
}

export async function connectDB() {
  await mongoose.connect(uri as string, { dbName: "groupmirror" });
  console.log("✅ MongoDB connected:", mongoose.connection.host);
}

