const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/groupmirror';
    // Skip MongoDB connection for now - using mock endpoints
    console.log('⚠️  Skipping MongoDB connection - using mock endpoints');
    return;
    // await mongoose.connect(mongoUri);
    // console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Don't exit on MongoDB error for now
    console.log('⚠️  Continuing without MongoDB');
  }
};

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Group Mirror API is running',
    timestamp: new Date().toISOString()
  });
});

// Simple auth endpoints (mock implementation)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication - in real app, validate against database
  if (email && password) {
    const mockToken = 'mock-jwt-token-' + Date.now();
    res.json({
      token: mockToken,
      user: {
        id: 'mock-user-id',
        email: email,
        name: email.split('@')[0]
      }
    });
  } else {
    res.status(400).json({ message: 'Email and password required' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Mock registration
  if (email && password && name) {
    const mockToken = 'mock-jwt-token-' + Date.now();
    res.json({
      token: mockToken,
      user: {
        id: 'mock-user-id',
        email: email,
        name: name
      }
    });
  } else {
    res.status(400).json({ message: 'Email, password, and name required' });
  }
});

// Mock mood endpoints
app.get('/api/moods/history', (req, res) => {
  res.json([]); // Empty array for now
});

app.get('/api/moods/trends', (req, res) => {
  res.json([]); // Empty array for now
});

app.post('/api/moods', (req, res) => {
  res.json({
    _id: 'mock-mood-id',
    rating: req.body.rating || 5,
    notes: req.body.notes || '',
    date: new Date().toISOString(),
    userId: 'mock-user-id'
  });
});

// Mock group endpoints
app.get('/api/groups', (req, res) => {
  res.json([]); // Empty array for now
});

app.get('/api/groups/:id', (req, res) => {
  res.json({
    _id: req.params.id,
    name: 'Mock Group',
    description: 'This is a mock group',
    members: []
  });
});

app.get('/api/groups/:id/moods', (req, res) => {
  res.json([]); // Empty array for now
});

// Mock profile endpoints
app.get('/api/profile/settings', (req, res) => {
  res.json({
    notifications: true,
    emailReminders: true,
    moodReminderTime: '20:00',
    theme: 'light',
    timezone: 'UTC'
  });
});

app.put('/api/profile/settings', (req, res) => {
  res.json({ message: 'Settings saved successfully' });
});

app.delete('/api/profile', (req, res) => {
  res.json({ message: 'Account deleted successfully' });
});

// Start server
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  });
})();
