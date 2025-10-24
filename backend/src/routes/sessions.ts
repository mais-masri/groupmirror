/**
 * Sessions Routes - API endpoints for scheduling and managing support sessions
 * Handles creating, retrieving, and managing group support sessions
 */
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Group from '../models/Group';
import User from '../models/User';
import { z } from 'zod';

const router = Router();

// Middleware to authenticate token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Validation schemas
const createSessionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Session title is required').max(100, 'Title too long'),
    description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
    scheduledDate: z.string().datetime('Invalid date format'),
    sessionType: z.enum(['check_in', 'mood_review', 'support_circle', 'urgent_support']).optional(),
    groupId: z.string().min(1, 'Group ID is required')
  })
});

const getSessionsSchema = z.object({
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required')
  })
});

// POST /api/sessions - Create a new support session
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, scheduledDate, sessionType = 'support_circle', groupId } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Verify user is admin or member of the group
    const group = await Group.findOne({
      _id: groupId,
      $or: [
        { adminId: userId },
        { members: userId }
      ],
      isActive: true
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found or you are not a member'
      });
    }

    // Create session object (we'll store it in the group document for now)
    const newSession = {
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      scheduledDate: new Date(scheduledDate),
      sessionType,
      createdBy: userId,
      participants: group.members,
      status: 'scheduled',
      createdAt: new Date()
    };

    // Add session to group
    if (!group.sessions) {
      group.sessions = [];
    }
    group.sessions.push(newSession);
    await group.save();

    res.status(201).json({
      success: true,
      message: 'Support session scheduled successfully',
      data: {
        _id: newSession._id,
        title: newSession.title,
        description: newSession.description,
        scheduledDate: newSession.scheduledDate,
        sessionType: newSession.sessionType,
        participants: newSession.participants.length,
        status: newSession.status,
        groupName: group.name
      }
    });

  } catch (error: any) {
    console.error('Session creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule session',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/sessions/:groupId - Get sessions for a specific group
router.get('/:groupId', authenticateToken, async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Verify user is member of the group
    const group = await Group.findOne({
      _id: groupId,
      $or: [
        { adminId: userId },
        { members: userId }
      ],
      isActive: true
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found or you are not a member'
      });
    }

    // Get sessions (default to empty array if none exist)
    const sessions = group.sessions || [];
    
    // Filter upcoming sessions only
    const now = new Date();
    const upcomingSessions = sessions.filter(session => 
      new Date(session.scheduledDate) > now
    ).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

    res.json({
      success: true,
      data: upcomingSessions,
      count: upcomingSessions.length
    });

  } catch (error: any) {
    console.error('Session retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve sessions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/sessions/:sessionId/join - Join a session
router.post('/:sessionId/join', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Find group with this session
    const group = await Group.findOne({
      'sessions._id': sessionId,
      $or: [
        { adminId: userId },
        { members: userId }
      ],
      isActive: true
    });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or you are not authorized'
      });
    }

    // Find the specific session
    const session = group.sessions.find(s => s._id.toString() === sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Check if session is in the future
    if (new Date(session.scheduledDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot join past sessions'
      });
    }

    res.json({
      success: true,
      message: 'Successfully joined the session',
      data: {
        sessionId: session._id,
        title: session.title,
        scheduledDate: session.scheduledDate,
        participants: session.participants.length
      }
    });

  } catch (error: any) {
    console.error('Session join error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join session',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
