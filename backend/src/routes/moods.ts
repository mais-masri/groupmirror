/**
 * Mood Routes - API endpoints for mood tracking
 * Handles creating, updating, and retrieving mood entries with authentication and date support
 */
import { Router } from "express";
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Mood from '../models/Mood';
import { validateRequest } from '../middleware/validateRequest';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createMoodSchema = z.object({
  body: z.object({
    moodType: z.enum(['Happy', 'Motivated', 'Neutral', 'Sad', 'Stressed']),
    moodLevel: z.number().min(1).max(5),
    description: z.string().max(100).optional(),
    date: z.string().optional(), // Will be converted to Date
  }),
});

const getMoodsSchema = z.object({
  query: z.object({
    year: z.string().optional(),
    month: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
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

// Create a new mood entry
router.post('/', authenticateToken, validateRequest(createMoodSchema), async (req, res) => {
  try {
    const { moodType, moodLevel, description, date } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Use provided date or default to today
    const moodDate = date ? new Date(date) : new Date();
    
    // Check if user already has a mood entry for this date
    const existingMood = await Mood.findOne({
      userId,
      date: {
        $gte: new Date(moodDate.getFullYear(), moodDate.getMonth(), moodDate.getDate()),
        $lt: new Date(moodDate.getFullYear(), moodDate.getMonth(), moodDate.getDate() + 1)
      }
    });

    if (existingMood) {
      // Update existing mood
      existingMood.moodType = moodType;
      existingMood.moodLevel = moodLevel;
      existingMood.description = description;
      await existingMood.save();

      return res.json({
        success: true,
        message: 'Mood updated successfully',
        data: existingMood
      });
    }

    // Create new mood entry
    const newMood = new Mood({
      userId,
      moodType,
      moodLevel,
      description,
      date: moodDate
    });

    await newMood.save();

    res.status(201).json({
      success: true,
      message: 'Mood recorded successfully',
      data: newMood
    });

  } catch (error: any) {
    console.error('Mood creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record mood',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get mood entries for a user
router.get('/', authenticateToken, validateRequest(getMoodsSchema), async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }
    
    const { year, month, startDate, endDate } = req.query;

    let query: any = { userId };

    // Build date filter based on query parameters
    if (year) {
      const yearNum = parseInt(year as string);
      query.date = {
        $gte: new Date(yearNum, 0, 1),
        $lt: new Date(yearNum + 1, 0, 1)
      };
    }

    if (month && year) {
      const yearNum = parseInt(year as string);
      const monthNum = parseInt(month as string) - 1; // JavaScript months are 0-indexed
      query.date = {
        $gte: new Date(yearNum, monthNum, 1),
        $lt: new Date(yearNum, monthNum + 1, 1)
      };
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lt: new Date(endDate as string)
      };
    }

    const moods = await Mood.find(query)
      .sort({ date: -1 })
      .select('-userId'); // Exclude userId from response

    res.json({
      success: true,
      data: moods,
      count: moods.length
    });

  } catch (error: any) {
    console.error('Mood retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve moods',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get today's mood for a user
router.get('/today', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }
    
    const today = new Date();
    
    const todayMood = await Mood.findOne({
      userId,
      date: {
        $gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        $lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
      }
    }).select('-userId');

    res.json({
      success: true,
      data: todayMood,
      hasMoodToday: !!todayMood
    });

  } catch (error: any) {
    console.error('Today mood retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve today\'s mood',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get mood statistics for a user
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }
    
    const { year } = req.query;

    let dateFilter: any = {};
    if (year) {
      const yearNum = parseInt(year as string);
      dateFilter = {
        $gte: new Date(yearNum, 0, 1),
        $lt: new Date(yearNum + 1, 0, 1)
      };
    }

    const stats = await Mood.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}) } },
      {
        $group: {
          _id: '$moodType',
          count: { $sum: 1 },
          avgLevel: { $avg: '$moodLevel' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const totalMoods = await Mood.countDocuments({ userId, ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}) });

    res.json({
      success: true,
      data: {
        stats,
        totalMoods,
        year: year || new Date().getFullYear()
      }
    });

  } catch (error: any) {
    console.error('Mood stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve mood statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
