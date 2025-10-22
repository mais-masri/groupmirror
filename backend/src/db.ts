import mongoose from "mongoose";
import "dotenv/config";

const rawUri = process.env.MONGODB_URI;
if (!rawUri) throw new Error("❌ MONGODB_URI is not set. Put it in backend/.env");
const URI: string = rawUri;

export async function connectDB(): Promise<void> {
  const hostHint = URI.includes("@") ? URI.split("@")[1] : URI;
  console.log("[DB] Connecting to:", hostHint);

  try {
    await mongoose.connect(URI, {
      dbName: "groupmirror",
      serverSelectionTimeoutMS: 5000, // fail in 5s instead of hanging
    } as any);
    console.log("✅ MongoDB connected:", mongoose.connection.host);
  } catch (err: any) {
    console.error("❌ MongoDB connection failed:", err?.message || err);
    process.exit(1);
  }

  mongoose.connection.on("error", (e) => console.error("[DB] Error:", e.message));
  mongoose.connection.on("disconnected", () => console.warn("[DB] Disconnected"));
}
