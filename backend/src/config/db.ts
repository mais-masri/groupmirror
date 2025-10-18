import mongoose from 'mongoose';

export async function connectDB(uri: string) {
  if (!uri) throw new Error('MONGO_URI is missing');
  try {
    await mongoose.connect(uri, { autoIndex: true });
    const { host, port, name } = mongoose.connection;
    console.log(`✅ Mongo connected: ${host}:${port}/${name}`);
  } catch (err) {
    console.error('❌ Mongo connection error:', err);
    throw err;
  }
}

export function mongoHealth() {
  const s = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  return { readyState: s };
}
