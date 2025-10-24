/**
 * Clear Demo Data - Removes all demo/test data from the database
 * This script removes all users, groups, moods, and messages to ensure
 * new users start with a clean slate
 */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import User from '../models/User';
import Group from '../models/Group';
import Mood from '../models/Mood';
import Message from '../models/Message';

// Load environment variables
dotenv.config();

async function clearDemoData() {
  console.log('🧹 Starting demo data cleanup...');

  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(uri, { 
      dbName: 'groupmirror', 
      serverSelectionTimeoutMS: 8000 
    });
    console.log('✅ Connected to MongoDB');

    // Get counts before deletion
    const userCount = await User.countDocuments();
    const groupCount = await Group.countDocuments();
    const moodCount = await Mood.countDocuments();
    const messageCount = await Message.countDocuments();

    console.log(`📊 Current data counts:`);
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Groups: ${groupCount}`);
    console.log(`   - Moods: ${moodCount}`);
    console.log(`   - Messages: ${messageCount}`);

    if (userCount === 0 && groupCount === 0 && moodCount === 0 && messageCount === 0) {
      console.log('✅ Database is already clean - no demo data found');
      return;
    }

    // Clear all data
    console.log('🧹 Clearing all data...');
    await User.deleteMany({});
    await Group.deleteMany({});
    await Mood.deleteMany({});
    await Message.deleteMany({});
    console.log('✅ All data cleared successfully');

    // Verify cleanup
    const finalUserCount = await User.countDocuments();
    const finalGroupCount = await Group.countDocuments();
    const finalMoodCount = await Mood.countDocuments();
    const finalMessageCount = await Message.countDocuments();

    console.log(`\n📊 Final data counts:`);
    console.log(`   - Users: ${finalUserCount}`);
    console.log(`   - Groups: ${finalGroupCount}`);
    console.log(`   - Moods: ${finalMoodCount}`);
    console.log(`   - Messages: ${finalMessageCount}`);

    console.log('\n🎉 Demo data cleanup completed successfully!');
    console.log('✅ New users will now see empty states instead of demo data');

  } catch (error) {
    console.error('❌ Demo data cleanup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run cleanup if this file is executed directly
if (require.main === module) {
  clearDemoData()
    .then(() => {
      console.log('✅ Cleanup process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Cleanup process failed:', error);
      process.exit(1);
    });
}

export { clearDemoData };
