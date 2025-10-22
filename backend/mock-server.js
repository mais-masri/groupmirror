/**
 * Mock Server for Development and Testing
 * 
 * This is a lightweight mock server for:
 * - Frontend development without backend dependencies
 * - Testing API integrations
 * - Quick prototyping
 * 
 * Usage: node mock-server.js
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Health endpoints
app.get('/health', (req, res) => {
  res.json({ 
    ok: true,
    message: 'Mock server is working!',
    port: PORT,
    mode: 'mock',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mode: 'mock' });
});

// Mock Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }

  res.json({
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'mock-user-123',
      email: email,
      username: email.split('@')[0],
      firstName: 'Mock',
      lastName: 'User'
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

  res.json({
    success: true,
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: 'mock-user-' + Date.now(),
      email: email,
      username: username,
      firstName: firstName || 'Mock',
      lastName: lastName || 'User'
    }
  });
});

// Mock Mood endpoints
app.get('/api/moods', (req, res) => {
  const mockMoods = [
    {
      _id: 'mock-mood-1',
      rating: 4,
      notes: 'Feeling great!',
      date: new Date().toISOString(),
      userId: 'mock-user-123'
    },
    {
      _id: 'mock-mood-2', 
      rating: 3,
      notes: 'Pretty good day',
      date: new Date(Date.now() - 86400000).toISOString(),
      userId: 'mock-user-123'
    },
    {
      _id: 'mock-mood-3',
      rating: 5,
      notes: 'Amazing day!',
      date: new Date(Date.now() - 172800000).toISOString(),
      userId: 'mock-user-123'
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
    _id: 'mock-mood-' + Date.now(),
    rating: parseInt(rating),
    notes: notes || '',
    date: new Date().toISOString(),
    userId: 'mock-user-123'
  };

  res.json({
    success: true,
    data: newMood
  });
});

// Mock Group endpoints
app.get('/api/groups', (req, res) => {
  const mockGroups = [
    {
      _id: 'mock-group-1',
      name: 'Family Group',
      description: 'Our family mood tracking',
      members: ['mock-user-123', 'mock-user-456'],
      owner: 'mock-user-123',
      isPrivate: false,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'mock-group-2',
      name: 'Work Team',
      description: 'Team wellness tracking',
      members: ['mock-user-123', 'mock-user-789'],
      owner: 'mock-user-789',
      isPrivate: true,
      createdAt: new Date().toISOString()
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
    _id: 'mock-group-' + Date.now(),
    name: name,
    description: description || '',
    members: ['mock-user-123'],
    owner: 'mock-user-123',
    isPrivate: isPrivate || false,
    createdAt: new Date().toISOString()
  };

  res.json({
    success: true,
    data: newGroup
  });
});

// Mock Profile endpoints
app.get('/api/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 'mock-user-123',
      email: 'mock@example.com',
      username: 'mockuser',
      firstName: 'Mock',
      lastName: 'User',
      createdAt: new Date().toISOString()
    }
  });
});

app.put('/api/profile', (req, res) => {
  const { firstName, lastName, username } = req.body;
  
  res.json({
    success: true,
    data: {
      id: 'mock-user-123',
      email: 'mock@example.com',
      username: username || 'mockuser',
      firstName: firstName || 'Mock',
      lastName: lastName || 'User',
      updatedAt: new Date().toISOString()
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Group Mirror Mock API',
    version: '1.0.0',
    mode: 'mock',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      moods: '/api/moods',
      groups: '/api/groups',
      profile: '/api/profile'
    },
    note: 'This is a mock server for development and testing'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    mode: 'mock'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Mock server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    mode: 'mock',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 [MOCK] Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
  console.log(`😊 Mood endpoints: http://localhost:${PORT}/api/moods`);
  console.log(`👥 Group endpoints: http://localhost:${PORT}/api/groups`);
  console.log(`👤 Profile endpoints: http://localhost:${PORT}/api/profile`);
  console.log(`⚠️  This is a MOCK server - no real data persistence`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('❌ Mock server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    const newPort = PORT + 1;
    app.listen(newPort, () => {
      console.log(`🚀 [MOCK] Server running on port ${newPort}`);
    });
  }
});

console.log('Starting mock server...');
