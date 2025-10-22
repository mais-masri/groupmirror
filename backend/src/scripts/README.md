# MongoDB Connection and Collection Creation Scripts

This directory contains scripts that demonstrate how to connect to MongoDB and create new collections (tables).

## Files

### 1. `createNewTable.ts` - Simple Collection Creation
A straightforward script that shows how to:
- Connect to MongoDB
- Define a new schema
- Create a new collection (called "tasks")
- Insert sample data
- Perform basic CRUD operations

### 2. `mongoConnectionDemo.ts` - Comprehensive Demo
A more detailed script that demonstrates:
- Advanced MongoDB connection handling
- Complex schema with validation
- Multiple collection operations
- Error handling
- Collection statistics

## How to Use

### Prerequisites
1. Make sure you have a `.env` file in the `backend/` directory with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/groupmirror
   ```
   or for MongoDB Atlas:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/groupmirror
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Scripts

#### Option 1: Run the simple script
```bash
cd backend
npx ts-node src/scripts/createNewTable.ts
```

#### Option 2: Run the comprehensive demo
```bash
cd backend
npx ts-node src/scripts/mongoConnectionDemo.ts
```

#### Option 3: Compile and run
```bash
cd backend
npm run build
node dist/scripts/createNewTable.js
```

## What These Scripts Do

### Collection Creation
- **MongoDB Collections**: In MongoDB, "tables" are called "collections"
- **Schema Definition**: Define the structure of your documents
- **Model Creation**: Create a Mongoose model that represents your collection
- **Automatic Creation**: Collections are created automatically when you insert the first document

### Key Concepts Demonstrated

1. **Connection**: How to connect to MongoDB using Mongoose
2. **Schema Definition**: How to define document structure with validation
3. **Model Creation**: How to create a Mongoose model
4. **Data Insertion**: How to insert documents into collections
5. **Data Retrieval**: How to query documents from collections
6. **Data Updates**: How to update existing documents
7. **Data Deletion**: How to remove documents from collections

## Example Output

When you run the scripts, you should see output like:
```
🚀 Starting MongoDB Connection and Collection Creation Demo

🔌 Connecting to MongoDB...
✅ Connected to MongoDB successfully!
📊 Database: groupmirror

📝 Creating Tasks collection...
✅ Created 3 sample tasks in the collection
📊 Total tasks in collection: 3
📈 Collection Statistics: { name: 'tasks', documentCount: 3, ... }

🔍 Demonstrating collection operations...
📋 Found 3 tasks:
1. Setup MongoDB Connection (completed)
2. Create User Authentication (in-progress)
3. Design API Endpoints (pending)

✅ Demo completed successfully!
🔌 MongoDB connection closed
```

## Customizing for Your Needs

To create your own collection:

1. **Define your schema** - Modify the schema definition to match your data structure
2. **Change the model name** - Update the model name and collection name
3. **Add validation rules** - Customize validation rules for your fields
4. **Update sample data** - Modify the sample data to match your use case

## Troubleshooting

### Common Issues

1. **Connection Error**: Make sure your MongoDB server is running and the connection string is correct
2. **Environment Variables**: Ensure your `.env` file is in the correct location and properly formatted
3. **Dependencies**: Make sure all required packages are installed (`mongoose`, `dotenv`)

### Getting Help

- Check the MongoDB documentation for schema options
- Review Mongoose documentation for advanced features
- Ensure your MongoDB server is accessible from your application


