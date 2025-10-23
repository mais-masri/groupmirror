import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User';
import Group from '../models/Group';
import Mood from '../models/Mood';

async function seedRealData() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('❌ MONGODB_URI not found');
      process.exit(1);
    }

    await mongoose.connect(uri, { 
      dbName: 'groupmirror', 
      serverSelectionTimeoutMS: 8000 
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}), 
      Group.deleteMany({}), 
      Mood.deleteMany({})
    ]);

    // Create test users
    console.log('👥 Creating test users...');
    const passwordHash = await bcrypt.hash('password123', 12);
    
    const users = await User.create([
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        username: 'alice',
        password: passwordHash
      },
      {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@example.com',
        username: 'bob',
        password: passwordHash
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie@example.com',
        username: 'charlie',
        password: passwordHash
      },
      {
        firstName: 'Diana',
        lastName: 'Davis',
        email: 'diana@example.com',
        username: 'diana',
        password: passwordHash
      }
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create a test group
    console.log('👥 Creating test group...');
    const group = await Group.create({
      name: 'Development Team',
      description: 'Daily mood check-ins for our development team',
      adminId: users[0]._id,
      members: users.map(user => user._id),
      inviteCode: 'DEVTEAM2025'
    });

    console.log(`✅ Created group: ${group.name}`);

    // Create mood entries for each user
    console.log('😊 Creating mood entries...');
    const moodEntries = [];

    // Alice's moods (mostly positive)
    moodEntries.push(
      {
        userId: users[0]._id,
        moodType: 'Happy',
        moodLevel: 5,
        description: 'Great team meeting today!',
        date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000) // Today
      },
      {
        userId: users[0]._id,
        moodType: 'Motivated',
        moodLevel: 4,
        description: 'Productive coding session',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        userId: users[0]._id,
        moodType: 'Happy',
        moodLevel: 5,
        description: 'Deployed successfully!',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    );

    // Bob's moods (mixed)
    moodEntries.push(
      {
        userId: users[1]._id,
        moodType: 'Motivated',
        moodLevel: 4,
        description: 'Ready to tackle the day',
        date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000) // Today
      },
      {
        userId: users[1]._id,
        moodType: 'Neutral',
        moodLevel: 3,
        description: 'Regular workday',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        userId: users[1]._id,
        moodType: 'Stressed',
        moodLevel: 2,
        description: 'Bug fixing is challenging',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    );

    // Charlie's moods (mostly neutral)
    moodEntries.push(
      {
        userId: users[2]._id,
        moodType: 'Neutral',
        moodLevel: 3,
        description: 'Just a regular day',
        date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000) // Today
      },
      {
        userId: users[2]._id,
        moodType: 'Motivated',
        moodLevel: 4,
        description: 'Good progress on project',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: users[2]._id,
        moodType: 'Neutral',
        moodLevel: 3,
        description: 'Team collaboration going well',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      }
    );

    // Diana's moods (some challenges)
    moodEntries.push(
      {
        userId: users[3]._id,
        moodType: 'Sad',
        moodLevel: 2,
        description: 'Feeling a bit down',
        date: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000) // Today
      },
      {
        userId: users[3]._id,
        moodType: 'Stressed',
        moodLevel: 1,
        description: 'Very stressed lately',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Yesterday
      },
      {
        userId: users[3]._id,
        moodType: 'Happy',
        moodLevel: 5,
        description: 'Amazing day!',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    );

    await Mood.insertMany(moodEntries);
    console.log(`✅ Created ${moodEntries.length} mood entries`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Test Data Summary:');
    console.log(`👥 Users: ${users.length} (alice, bob, charlie, diana)`);
    console.log(`👥 Group: ${group.name} (ID: ${group._id})`);
    console.log(`😊 Mood Entries: ${moodEntries.length}`);
    console.log(`🔑 Invite Code: ${group.inviteCode}`);
    
    console.log('\n🔐 Login Credentials:');
    users.forEach(user => {
      console.log(`   ${user.username}@example.com / password123`);
    });

    console.log('\n🚀 Next Steps:');
    console.log('1. Login with any user credentials above');
    console.log('2. Go to Groups page and you should see "Development Team"');
    console.log('3. Visit Group Mood page to see real data!');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedRealData();
