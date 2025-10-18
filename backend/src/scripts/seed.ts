import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User';
import Group from '../models/Group';
import MoodEntry from '../models/Mood';

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}), 
      Group.deleteMany({}), 
      MoodEntry.deleteMany({})
    ]);

    // Create a test user
    const passwordHash = await bcrypt.hash('password123', 12);
    const user = await User.create({ 
      name: 'Mais', 
      email: 'mais@example.com', 
      password: passwordHash,
      username: 'mais',
      firstName: 'Mais',
      lastName: 'Test'
    });

    // Create a test group
    const group = await Group.create({ 
      name: 'GroupMirror Test', 
      owner: user._id, 
      members: [user._id],
      description: 'Test group for development'
    });

    // Create test mood entries
    await MoodEntry.create({ 
      userId: user._id, 
      groupId: group._id, 
      date: '2025-10-13',
      mood: {
        energy: 'high',
        happiness: 'very-high',
        stress: 'low',
        anxiety: 'low',
        motivation: 'high'
      },
      notes: 'Feeling great today!',
      tags: ['happy', 'productive']
    });

    await MoodEntry.create({ 
      userId: user._id, 
      groupId: group._id, 
      date: '2025-10-12',
      mood: {
        energy: 'medium',
        happiness: 'medium',
        stress: 'medium',
        anxiety: 'medium',
        motivation: 'medium'
      },
      notes: 'Average day',
      tags: ['neutral']
    });

    console.log('✅ Seeded successfully:', { 
      user: user.email, 
      group: group.name,
      moodEntries: 2
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

run();

