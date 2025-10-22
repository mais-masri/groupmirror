const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// MongoDB connection
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('⚠️  MONGODB_URI not found, running without database');
    return;
  }

  try {
    await mongoose.connect(uri, { 
      dbName: 'groupmirror', 
      serverSelectionTimeoutMS: 8000 
    });
    console.log('✅ [DB] Connected to MongoDB');
  } catch (err) {
    console.error('❌ [DB] Connection failed:', err);
    console.log('⚠️  Continuing without database connection');
  }
}

// Health endpoints
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.json({ 
    ok: true,
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    database: {
      status: dbStates[dbStatus] || 'unknown',
      readyState: dbStatus
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  const mockToken = 'jwt-token-' + Date.now();
  res.json({
    success: true,
    token: mockToken,
    user: {
      id: 'user-123',
      email: email,
      username: email.split('@')[0],
      firstName: 'John',
      lastName: 'Doe'
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  
  if (!email || !password || !username) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email, password, and username are required' 
    });
  }

  const mockToken = 'jwt-token-' + Date.now();
  res.json({
    success: true,
    token: mockToken,
    user: {
      id: 'user-' + Date.now(),
      email: email,
      username: username,
      firstName: firstName || 'User',
      lastName: lastName || 'Name'
    }
  });
});

// Mood endpoints
app.get('/api/moods', (req, res) => {
  const mockMoods = [
    {
      _id: 'mood-1',
      rating: 4,
      notes: 'Feeling good today!',
      date: new Date().toISOString(),
      userId: 'user-123'
    },
    {
      _id: 'mood-2', 
      rating: 3,
      notes: 'Average day',
      date: new Date(Date.now() - 86400000).toISOString(),
      userId: 'user-123'
    }
  ];
  
  res.json({
    success: true,
    data: mockMoods
  });
});

app.post('/api/moods', (req, res) => {
  const { rating, notes } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ 
      success: false, 
      message: 'Rating must be between 1 and 5' 
    });
  }

  const newMood = {
    _id: 'mood-' + Date.now(),
    rating: parseInt(rating),
    notes: notes || '',
    date: new Date().toISOString(),
    userId: 'user-123'
  };

  res.json({
    success: true,
    data: newMood
  });
});

// Group endpoints
app.get('/api/groups', (req, res) => {
  const mockGroups = [
    {
      _id: 'group-1',
      name: 'Family Group',
      description: 'Our family mood tracking',
      members: ['user-123', 'user-456'],
      owner: 'user-123',
      isPrivate: false
    },
    {
      _id: 'group-2',
      name: 'Work Team',
      description: 'Team wellness tracking',
      members: ['user-123', 'user-789'],
      owner: 'user-789',
      isPrivate: true
    }
  ];
  
  res.json({
    success: true,
    data: mockGroups
  });
});

app.post('/api/groups', (req, res) => {
  const { name, description, isPrivate } = req.body;
  
  if (!name) {
    return res.status(400).json({ 
      success: false, 
      message: 'Group name is required' 
    });
  }

  const newGroup = {
    _id: 'group-' + Date.now(),
    name: name,
    description: description || '',
    members: ['user-123'],
    owner: 'user-123',
    isPrivate: isPrivate || false
  };

  res.json({
    success: true,
    data: newGroup
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Group Mirror API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      moods: '/api/moods',
      groups: '/api/groups'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 [API] Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`😊 Mood endpoints: http://localhost:${PORT}/api/moods`);
  console.log(`👥 Group endpoints: http://localhost:${PORT}/api/groups`);
  
  // Connect to database in background
  connectDB().catch(() => {
    console.log('⚠️  Database connection failed, but server is running');
  });
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    const newPort = PORT + 1;
    app.listen(newPort, () => {
      console.log(`🚀 [API] Server running on port ${newPort}`);
    });
  }
});