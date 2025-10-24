/**
 * Chat Routes - API endpoints for group chat functionality
 * Handles sending and retrieving chat messages for groups
 */
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Message from '../models/Message';
import Group from '../models/Group';
import { validateRequest } from '../middleware/validateRequest';
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
const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message content is required').max(500, 'Message too long'),
    messageType: z.enum(['text', 'mood_share', 'support_request']).optional(),
  }),
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required')
  })
});

const getMessagesSchema = z.object({
  params: z.object({
    groupId: z.string().min(1, 'Group ID is required')
  }),
  query: z.object({
    limit: z.string().optional(),
    offset: z.string().optional()
  })
});

// Send a message to a group
router.post('/:groupId/messages', authenticateToken, validateRequest(sendMessageSchema), async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Verify user is a member of the group
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

    // Create new message
    const newMessage = new Message({
      groupId,
      userId,
      content,
      messageType
    });

    await newMessage.save();

    // Populate user info for response
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('userId', 'firstName lastName username')
      .select('-groupId');

    if (!populatedMessage) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve message'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        _id: populatedMessage._id,
        content: populatedMessage.content,
        messageType: populatedMessage.messageType,
        user: {
          name: `${(populatedMessage.userId as any).firstName} ${(populatedMessage.userId as any).lastName}`,
          id: (populatedMessage.userId as any)._id
        },
        createdAt: populatedMessage.createdAt
      }
    });

  } catch (error: any) {
    console.error('Message creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get messages for a group
router.get('/:groupId/messages', authenticateToken, validateRequest(getMessagesSchema), async (req, res) => {
  try {
    const { groupId } = req.params;
    const { limit = '50', offset = '0' } = req.query;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Verify user is a member of the group
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

    // Get messages with pagination
    const messages = await Message.find({ groupId })
      .populate('userId', 'firstName lastName username')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(offset as string))
      .select('-groupId');

    // Transform messages for frontend
    const transformedMessages = messages.map(message => ({
      _id: message._id,
      content: message.content,
      messageType: message.messageType,
      user: {
        name: `${(message.userId as any).firstName} ${(message.userId as any).lastName}`,
        id: (message.userId as any)._id
      },
      createdAt: message.createdAt
    })).reverse(); // Reverse to show oldest first

    return res.json({
      success: true,
      data: transformedMessages,
      count: transformedMessages.length
    });

  } catch (error: any) {
    console.error('Message retrieval error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve messages',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
