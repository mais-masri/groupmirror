/**
 * Profile Routes - API endpoints for user profile management
 * Handles getting, updating user profile information with authentication
 */
import { Router } from "express";
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

// Validation schemas
const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional(),
    username: z.string().min(3).optional(),
    email: z.string().email().optional(),
  }),
});

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err: any, user: any) => {
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

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/', authenticateToken, validateRequest(updateProfileSchema), async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }
    
    const { firstName, lastName, username, email } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username already in use'
        });
      }
    }

    // Update user fields
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }
    
    // Import Mood model
    const Mood = require('../models/Mood').default;
    
    // Get mood statistics
    const totalMoods = await Mood.countDocuments({ userId });
    const recentMoods = await Mood.find({ userId })
      .sort({ date: -1 })
      .limit(5)
      .select('moodType moodLevel date');

    // Calculate days since registration
    const user = await User.findById(userId).select('createdAt');
    const daysSinceRegistration = user ? 
      Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    res.json({
      success: true,
      data: {
        totalMoods,
        recentMoods,
        daysSinceRegistration,
        memberSince: user?.createdAt
      }
    });
  } catch (error: any) {
    console.error('Error getting profile stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile statistics',
      error: error.message
    });
  }
});

export default router;
