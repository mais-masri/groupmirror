import app from "./app";
// import { connectDB } from "./db";

const PORT = process.env.PORT || 3001;

(async () => {
  // Skip database connection for demo
  // await connectDB();
  console.log("🚀 Starting server in demo mode (no database)");
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 API Documentation: http://localhost:${PORT}/api/docs`);
  });
})();