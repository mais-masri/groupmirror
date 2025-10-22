import { MongoClient } from 'mongodb';
import 'dotenv/config';

// Example for Node.js with the official 'mongodb' driver

async function connectToMongoDB() {
  const uri = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas!");
    const db = client.db("groupmirror"); // Specify your database name
    // You can now interact with the 'db' object to perform database operations
    
    return { client, db };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  } finally {
    // Note: We don't close here as we want to keep the connection alive
    // await client.close(); // Close the connection when done
  }
}

export { connectToMongoDB };
