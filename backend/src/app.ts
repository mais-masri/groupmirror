import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import moodRoutes from './routes/moods';
import groupRoutes from './routes/groups';
import profileRoutes from './routes/profile';

// Import middleware
import { errorHandler, notFoundHandler } from './utils/errors';

// Load environment variables
dotenv.config();

const app: Application = express();

// Trust proxy for deployment
app.set('trust proxy', 1);

// MUST be before routes
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));
app.options('*', cors());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (_,res)=>res.json({ok:true}));

// DB health endpoint
app.get('/db/health', (req: Request, res: Response) => {
  const mongoose = require('mongoose');
  const readyState = mongoose.connection.readyState;
  res.status(200).json({ mongo: { readyState } });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/profile', profileRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Group Mirror API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health',
  });
});

// API documentation endpoint (placeholder)
app.get('/api/docs', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API Documentation',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/profile': 'Get user profile',
        'PUT /api/auth/profile': 'Update user profile',
        'PUT /api/auth/change-password': 'Change password',
      },
      moods: {
        'POST /api/moods': 'Create mood entry',
        'GET /api/moods': 'Get user mood entries',
        'GET /api/moods/today': 'Get today\'s mood',
        'GET /api/moods/summary': 'Get mood summary',
        'GET /api/moods/statistics': 'Get mood statistics',
        'GET /api/moods/:id': 'Get mood entry by ID',
        'PUT /api/moods/:id': 'Update mood entry',
        'DELETE /api/moods/:id': 'Delete mood entry',
        'GET /api/moods/group/:groupId': 'Get group mood entries',
        'GET /api/moods/group/:groupId/statistics': 'Get group mood statistics',
      },
      groups: {
        'POST /api/groups': 'Create group',
        'GET /api/groups': 'Get user groups',
        'GET /api/groups/:id': 'Get group by ID',
        'PUT /api/groups/:id': 'Update group',
        'DELETE /api/groups/:id': 'Delete group',
        'GET /api/groups/:id/members': 'Get group members',
        'POST /api/groups/:id/members': 'Add member',
        'DELETE /api/groups/:id/members/:userId': 'Remove member',
        'PUT /api/groups/:id/members/:userId/role': 'Update member role',
        'POST /api/groups/join': 'Join group',
        'POST /api/groups/:id/leave': 'Leave group',
        'GET /api/groups/:id/activity': 'Get group activity',
        'GET /api/groups/:id/mood-summary': 'Get group mood summary',
      },
      profile: {
        'GET /api/profile': 'Get profile',
        'PUT /api/profile': 'Update profile',
        'GET /api/profile/stats': 'Get user statistics',
        'GET /api/profile/export': 'Export user data',
        'DELETE /api/profile': 'Delete account',
      },
    },
  });
});

// 404 handler
app.use('*', notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
