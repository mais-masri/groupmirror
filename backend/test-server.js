const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080; // Different port

// Middleware
app.use(express.json());
app.use(cors());

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ 
    ok: true,
    message: 'Server is working!',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    token: 'mock-token',
    user: { id: '1', email: req.body.email, username: 'testuser' }
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    token: 'mock-token',
    user: { id: '1', email: req.body.email, username: req.body.username }
  });
});

app.get('/api/moods', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', rating: 4, notes: 'Good day', date: new Date().toISOString() }
    ]
  });
});

app.post('/api/moods', (req, res) => {
  res.json({
    success: true,
    data: { id: '1', rating: req.body.rating, notes: req.body.notes, date: new Date().toISOString() }
  });
});

app.get('/api/groups', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: '1', name: 'Test Group', description: 'A test group' }
    ]
  });
});

app.post('/api/groups', (req, res) => {
  res.json({
    success: true,
    data: { id: '1', name: req.body.name, description: req.body.description }
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Group Mirror API is running!',
    endpoints: ['/health', '/api/auth', '/api/moods', '/api/groups']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`😊 Moods: http://localhost:${PORT}/api/moods`);
  console.log(`👥 Groups: http://localhost:${PORT}/api/groups`);
  console.log('✅ Server started successfully!');
});

console.log('Starting server...');
