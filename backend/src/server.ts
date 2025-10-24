import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import moodRoutes from './routes/moods';
import profileRoutes from './routes/profile';
import settingsRoutes from './routes/settings';
import groupRoutes from './routes/groups';
import chatRoutes from './routes/chat';
import alertsRoutes from './routes/alerts';
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

// Health endpoints
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/alerts', alertsRoutes);

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
        'POST /api/moods': 'Create new mood entry',
        'DELETE /api/moods/:id': 'Delete a mood entry'
      },
      groups: {
        'GET /api/groups': 'Get user groups',
        'POST /api/groups': 'Create new group',
        'GET /api/groups/:id': 'Get specific group details',
        'GET /api/groups/:id/moods': 'Get group mood entries',
        'GET /api/groups/:id/stats': 'Get group statistics',
        'POST /api/groups/join': 'Join group with invite code',
        'POST /api/groups/:groupId/leave': 'Leave group'
      },
      chat: {
        'GET /api/chat/:groupId/messages': 'Get group chat messages',
        'POST /api/chat/:groupId/messages': 'Send message to group'
      },
      alerts: {
        'GET /api/alerts': 'Get real mood alerts based on actual data'
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
  console.log(`⚙️ Settings endpoints: http://localhost:${PORT}/api/settings`);
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
