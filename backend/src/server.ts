import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

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

// Routes
app.use('/api/auth', authRoutes);

// Mood endpoints
app.get('/api/moods', (req, res) => {
  // Mock mood data
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

  return res.json({
    success: true,
    data: newMood
  });
});

// Group endpoints
app.get('/api/groups', (req, res) => {
  // Mock group data
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

  return res.json({
    success: true,
    data: newGroup
  });
});

// Profile endpoints
app.get('/api/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'user-123',
      email: 'user@example.com',
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date().toISOString()
    }
  });
});

app.put('/api/profile', (req, res) => {
  const { firstName, lastName, username } = req.body;
  
  res.json({
    success: true,
    data: {
      id: 'user-123',
      email: 'user@example.com',
      username: username || 'testuser',
      firstName: firstName || 'John',
      lastName: lastName || 'Doe',
      updatedAt: new Date().toISOString()
    }
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
      groups: '/api/groups',
      profile: '/api/profile'
    }
  });
});

// API documentation
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'Group Mirror API Documentation',
    version: '1.0.0',
    endpoints: {
      health: {
        'GET /health': 'Health check with database status',
        'GET /api/health': 'Simple health check'
      },
      auth: {
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/register': 'Register new user'
      },
      moods: {
        'GET /api/moods': 'Get user mood entries',
        'POST /api/moods': 'Create new mood entry'
      },
      groups: {
        'GET /api/groups': 'Get user groups',
        'POST /api/groups': 'Create new group'
      },
      profile: {
        'GET /api/profile': 'Get user profile',
        'PUT /api/profile': 'Update user profile'
      }
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
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [API] Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/docs`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`😊 Mood endpoints: http://localhost:${PORT}/api/moods`);
  console.log(`👥 Group endpoints: http://localhost:${PORT}/api/groups`);
  console.log(`👤 Profile endpoints: http://localhost:${PORT}/api/profile`);
  console.log(`🌐 Server accessible at: http://0.0.0.0:${PORT}`);
  
  // Connect to database in background
  connectDB().catch(() => {
    console.log('⚠️  Database connection failed, but server is running');
  });
});

// Handle server errors
server.on('error', (err: any) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    const newPort = PORT + 1;
    app.listen(newPort, '0.0.0.0', () => {
      console.log(`🚀 [API] Server running on port ${newPort}`);
    });
  }
});
