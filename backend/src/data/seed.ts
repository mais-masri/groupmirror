import { userService, moodService, groupService } from '../services';
import { hashPassword } from '../utils/auth';

// Sample data for development
const sampleUsers = [
  {
    email: 'john@example.com',
    username: 'john_doe',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    email: 'jane@example.com',
    username: 'jane_smith',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
  },
  {
    email: 'mike@example.com',
    username: 'mike_wilson',
    password: 'password123',
    firstName: 'Mike',
    lastName: 'Wilson',
  },
  {
    email: 'sarah@example.com',
    username: 'sarah_johnson',
    password: 'password123',
    firstName: 'Sarah',
    lastName: 'Johnson',
  },
  {
    email: 'alex@example.com',
    username: 'alex_brown',
    password: 'password123',
    firstName: 'Alex',
    lastName: 'Brown',
  },
];

const sampleGroups = [
  {
    name: 'Team Alpha',
    description: 'Our main development team',
    settings: {
      allowAnonymousMoods: false,
      requireApprovalForJoins: false,
      moodVisibility: 'members-only' as const,
      allowMemberInvites: true,
    },
  },
  {
    name: 'Wellness Circle',
    description: 'A supportive group for mental health and wellness',
    settings: {
      allowAnonymousMoods: true,
      requireApprovalForJoins: true,
      moodVisibility: 'public' as const,
      allowMemberInvites: true,
    },
  },
  {
    name: 'Study Group',
    description: 'College study group for sharing academic stress',
    settings: {
      allowAnonymousMoods: false,
      requireApprovalForJoins: false,
      moodVisibility: 'members-only' as const,
      allowMemberInvites: false,
    },
  },
];

const moodLevels = ['very-low', 'low', 'medium', 'high', 'very-high'] as const;
const sampleTags = ['work', 'family', 'health', 'relationships', 'finances', 'hobbies', 'travel'];

// Generate random mood entry
function generateRandomMood() {
  const energy = moodLevels[Math.floor(Math.random() * moodLevels.length)];
  const happiness = moodLevels[Math.floor(Math.random() * moodLevels.length)];
  const stress = moodLevels[Math.floor(Math.random() * moodLevels.length)];
  const anxiety = moodLevels[Math.floor(Math.random() * moodLevels.length)];
  const motivation = moodLevels[Math.floor(Math.random() * moodLevels.length)];

  const randomTags = sampleTags
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);

  const notes = [
    'Had a great day!',
    'Feeling a bit stressed today.',
    'Excited about the weekend!',
    'Need to focus more on self-care.',
    'Really productive day at work.',
    'Feeling grateful for my friends.',
    'Could use some rest.',
    'Looking forward to new opportunities.',
  ][Math.floor(Math.random() * 8)];

  return {
    mood: { energy, happiness, stress, anxiety, motivation },
    tags: randomTags,
    notes: Math.random() > 0.3 ? notes : undefined,
    isPrivate: Math.random() > 0.8,
  };
}

// Generate date string (YYYY-MM-DD format)
function generateDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await userService.resetData();
    await moodService.resetData();
    await groupService.resetData();

    // Create users
    console.log('👥 Creating users...');
    const users = [];
    for (const userData of sampleUsers) {
      try {
        const user = await userService.create(userData);
        users.push(user);
        console.log(`✅ Created user: ${user.username}`);
      } catch (error) {
        console.error(`❌ Failed to create user ${userData.username}:`, error);
      }
    }

    if (users.length === 0) {
      throw new Error('No users were created');
    }

    // Create groups
    console.log('👥 Creating groups...');
    const groups = [];
    for (let i = 0; i < sampleGroups.length; i++) {
      try {
        const groupData = sampleGroups[i];
        const creator = users[i % users.length]; // Rotate creators
        const group = await groupService.createGroup(groupData, creator.id);
        groups.push(group);
        console.log(`✅ Created group: ${group.name}`);

        // Add other users as members
        for (let j = 0; j < users.length; j++) {
          if (j !== i % users.length) {
            const role = Math.random() > 0.8 ? 'admin' : 'member';
            await groupService.addMember(group.id, users[j].id, role);
          }
        }
      } catch (error) {
        console.error(`❌ Failed to create group ${sampleGroups[i].name}:`, error);
      }
    }

    // Create mood entries
    console.log('😊 Creating mood entries...');
    let moodCount = 0;
    
    for (const user of users) {
      // Create mood entries for the last 30 days
      for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
        // 80% chance of creating a mood entry for each day
        if (Math.random() > 0.2) {
          try {
            const date = generateDate(daysAgo);
            const moodData = generateRandomMood();
            
            // Assign to a random group sometimes
            const groupId = Math.random() > 0.5 && groups.length > 0 
              ? groups[Math.floor(Math.random() * groups.length)].id 
              : undefined;

            const moodEntry = await moodService.createMoodEntry(user.id, {
              ...moodData,
              date,
              groupId,
            });
            
            moodCount++;
          } catch (error) {
            // Skip if mood entry already exists for this date
            if (!(error as any).message?.includes('already exists')) {
              console.error(`❌ Failed to create mood entry for ${user.username}:`, error);
            }
          }
        }
      }
    }

    console.log(`✅ Created ${moodCount} mood entries`);

    // Summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Groups: ${groups.length}`);
    console.log(`   - Mood entries: ${moodCount}`);
    console.log('\n🔐 Test credentials:');
    console.log('   - Email: john@example.com, Password: password123');
    console.log('   - Email: jane@example.com, Password: password123');
    console.log('   - Email: mike@example.com, Password: password123');
    console.log('\n🚀 You can now start the server with: npm run dev');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };
