import mongoose from 'mongoose';
import 'dotenv/config';

/**
 * Simple script to connect to MongoDB and create a new collection (table)
 * This demonstrates the basic pattern for creating new collections in MongoDB
 */

// Step 1: Connect to MongoDB
async function connectToDatabase(): Promise<void> {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/groupmirror';
  
  console.log('🔌 Connecting to MongoDB...');
  
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'groupmirror',
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ Connected to MongoDB successfully!');
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Step 2: Define a new schema for your collection
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: false
  },
  assignedTo: {
    type: String,
    required: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
  collection: 'tasks' // Explicitly set collection name
});

// Step 3: Create the model (this creates the collection if it doesn't exist)
const Task = mongoose.model('Task', TaskSchema);

// Step 4: Function to create the collection with sample data
async function createTasksCollection(): Promise<void> {
  try {
    console.log('\n📝 Creating Tasks collection...');
    
    // Check if collection already exists
    const collections = await mongoose.connection.db!.listCollections({ name: 'tasks' }).toArray();
    
    if (collections.length > 0) {
      console.log('⚠️  Tasks collection already exists');
    } else {
      console.log('✅ Tasks collection will be created when first document is inserted');
    }
    
    // Insert sample data to create the collection
    const sampleTasks = [
      {
        title: 'Setup MongoDB Connection',
        description: 'Configure MongoDB connection for the application',
        priority: 'high',
        status: 'completed',
        tags: ['database', 'setup']
      },
      {
        title: 'Create User Authentication',
        description: 'Implement user login and registration system',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        tags: ['auth', 'security']
      },
      {
        title: 'Design API Endpoints',
        description: 'Plan and design REST API endpoints for the application',
        priority: 'medium',
        status: 'pending',
        tags: ['api', 'planning']
      }
    ];
    
    // Insert the sample tasks
    const insertedTasks = await Task.insertMany(sampleTasks);
    console.log(`✅ Created ${insertedTasks.length} sample tasks in the collection`);
    
    // Verify collection was created
    const taskCount = await Task.countDocuments();
    console.log(`📊 Total tasks in collection: ${taskCount}`);
    
    // Show collection info
    const collectionStats = await mongoose.connection.db!.admin().command({ collStats: 'tasks' });
    console.log('📈 Collection Statistics:', {
      name: collectionStats.ns,
      documentCount: collectionStats.count,
      sizeInBytes: collectionStats.size,
      averageDocumentSize: collectionStats.avgObjSize
    });
    
  } catch (error) {
    console.error('❌ Error creating tasks collection:', error);
    throw error;
  }
}

// Step 5: Function to demonstrate basic operations on the new collection
async function demonstrateCollectionOperations(): Promise<void> {
  try {
    console.log('\n🔍 Demonstrating collection operations...');
    
    // Find all tasks
    const allTasks = await Task.find();
    console.log(`\n📋 Found ${allTasks.length} tasks:`);
    allTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.title} (${task.status})`);
    });
    
    // Find tasks by status
    const pendingTasks = await Task.find({ status: 'pending' });
    console.log(`\n⏳ Pending tasks: ${pendingTasks.length}`);
    
    // Find high priority tasks
    const highPriorityTasks = await Task.find({ priority: 'high' });
    console.log(`\n🔥 High priority tasks: ${highPriorityTasks.length}`);
    
    // Update a task
    const taskToUpdate = await Task.findOne({ status: 'pending' });
    if (taskToUpdate) {
      await Task.findByIdAndUpdate(taskToUpdate._id, { status: 'in-progress' });
      console.log(`\n✅ Updated task "${taskToUpdate.title}" to in-progress`);
    }
    
  } catch (error) {
    console.error('❌ Error demonstrating operations:', error);
    throw error;
  }
}

// Step 6: Main function to run everything
async function main(): Promise<void> {
  try {
    console.log('🚀 Starting MongoDB Connection and Collection Creation Demo\n');
    
    // Connect to database
    await connectToDatabase();
    
    // Create the new collection
    await createTasksCollection();
    
    // Demonstrate operations
    await demonstrateCollectionOperations();
    
    // List all collections in the database
    console.log('\n📋 All collections in the database:');
    const collections = await mongoose.connection.db!.listCollections().toArray();
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.name}`);
    });
    
    console.log('\n✅ Demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Export the functions for use in other files
export {
  connectToDatabase,
  Task,
  createTasksCollection,
  demonstrateCollectionOperations
};

// Run the script if executed directly
if (require.main === module) {
  main().catch(console.error);
}
