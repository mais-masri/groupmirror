/**
 * Group Routes - API endpoints for group management
 * Handles creating, joining, managing groups, and calculating group mood statistics
 */
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Group from '../models/Group';
import User from '../models/User';
import Mood from '../models/Mood';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

// Middleware to authenticate token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ success: false, message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Validation schemas
const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Group name is required').max(100, 'Group name too long'),
    description: z.string().max(500, 'Description too long').optional(),
  }),
});

const joinGroupSchema = z.object({
  body: z.object({
    inviteCode: z.string().min(1, 'Invite code is required').max(20, 'Invalid invite code'),
  }),
});

// Generate unique invite code
const generateInviteCode = async (): Promise<string> => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Check if code already exists
  const existingGroup = await Group.findOne({ inviteCode: code });
  if (existingGroup) {
    return generateInviteCode(); // Recursively generate new code
  }
  
  return code;
};

// GET user's groups
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    const groups = await Group.find({
      $or: [
        { adminId: userId },
        { members: userId }
      ],
      isActive: true
    })
    .populate('adminId', 'firstName lastName username')
    .populate('members', 'firstName lastName username')
    .sort({ updatedAt: -1 });

    // Add mood entries count for each group
    const groupsWithMoodCount = await Promise.all(
      groups.map(async (group) => {
        const moodCount = await Mood.countDocuments({
          userId: { $in: group.members }
        });
        
        return {
          ...group.toObject(),
          moodEntries: moodCount
        };
      })
    );

    res.json({ success: true, data: groupsWithMoodCount });
  } catch (error: any) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch groups', error: error.message });
  }
});

// GET specific group details
router.get('/:groupId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { groupId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    const group = await Group.findOne({
      _id: groupId,
      $or: [
        { adminId: userId },
        { members: userId }
      ],
      isActive: true
    })
    .populate('adminId', 'firstName lastName username')
    .populate('members', 'firstName lastName username');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Add mood entries count
    const moodCount = await Mood.countDocuments({
      userId: { $in: group.members }
    });

    const groupWithMoodCount = {
      ...group.toObject(),
      moodEntries: moodCount
    };

    res.json({ success: true, data: groupWithMoodCount });
  } catch (error: any) {
    console.error('Error fetching group:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch group', error: error.message });
  }
});

// POST create new group
router.post('/', authenticateToken, validateRequest(createGroupSchema), async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, description } = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    // Generate unique invite code
    const inviteCode = await generateInviteCode();

    const newGroup = new Group({
      name,
      description: description || '',
      adminId: userId,
      members: [userId], // Admin is automatically a member
      inviteCode,
    });

    await newGroup.save();

    // Populate the response
    const populatedGroup = await Group.findById(newGroup._id)
      .populate('adminId', 'firstName lastName username')
      .populate('members', 'firstName lastName username');

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: populatedGroup
    });
  } catch (error: any) {
    console.error('Error creating group:', error);
    res.status(500).json({ success: false, message: 'Failed to create group', error: error.message });
  }
});

// POST join group with invite code
router.post('/join', authenticateToken, validateRequest(joinGroupSchema), async (req, res) => {
  try {
    const userId = req.user?.id;
    const { inviteCode } = req.body;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    const group = await Group.findOne({ 
      inviteCode: inviteCode.toUpperCase(), 
      isActive: true 
    });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Invalid invite code' });
    }

    // Check if user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this group' });
    }

    // Add user to group
    group.members.push(userId);
    await group.save();

    // Populate the response
    const populatedGroup = await Group.findById(group._id)
      .populate('adminId', 'firstName lastName username')
      .populate('members', 'firstName lastName username');

    res.json({
      success: true,
      message: 'Successfully joined group',
      data: populatedGroup
    });
  } catch (error: any) {
    console.error('Error joining group:', error);
    res.status(500).json({ success: false, message: 'Failed to join group', error: error.message });
  }
});

// GET group statistics
router.get('/:groupId/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { groupId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    const group = await Group.findOne({
      _id: groupId,
      $or: [
        { adminId: userId },
        { members: userId }
      ],
      isActive: true
    });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Get mood statistics for the group
    const Mood = require('../models/Mood').default;
    const moodCount = await Mood.countDocuments({
      userId: { $in: group.members }
    });

    const lastMood = await Mood.findOne({
      userId: { $in: group.members }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        memberCount: group.members.length,
        moodEntries: moodCount,
        lastActivity: lastMood ? lastMood.createdAt : group.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error fetching group stats:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch group stats', error: error.message });
  }
});

export default router;
