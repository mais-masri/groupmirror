/**
 * Settings Routes - API endpoints for user application settings
 * Manages user preferences for notifications, appearance, privacy, and theme settings
 */
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import UserSettings from '../models/UserSettings';
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

// Validation schema for updating settings
const updateSettingsSchema = z.object({
  body: z.object({
    // Notification Settings
    pushNotifications: z.boolean().optional(),
    emailReminders: z.boolean().optional(),
    moodReminderTime: z.string().optional(),
    weeklyReports: z.boolean().optional(),
    groupNotifications: z.boolean().optional(),
    
    // Appearance Settings
    theme: z.enum(['light', 'dark']).optional(),
    
    // Privacy Settings
    profileVisibility: z.enum(['public', 'friends', 'private']).optional(),
    moodSharing: z.boolean().optional(),
    dataExport: z.boolean().optional(),
  }),
});

// GET user settings
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    let settings = await UserSettings.findOne({ userId });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new UserSettings({ userId });
      await settings.save();
    }

    return res.json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch settings',
      error: error.message
    });
  }
});

// PUT update user settings
router.put('/', authenticateToken, validateRequest(updateSettingsSchema), async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    const updateData = req.body;
    
    // Find existing settings or create new ones
    let settings = await UserSettings.findOne({ userId });
    
    if (!settings) {
      settings = new UserSettings({ userId, ...updateData });
    } else {
      // Update only provided fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          (settings as any)[key] = updateData[key];
        }
      });
    }

    await settings.save();

    return res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message
    });
  }
});

// POST reset settings to defaults
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Delete existing settings
    await UserSettings.findOneAndDelete({ userId });
    
    // Create new default settings
    const defaultSettings = new UserSettings({ userId });
    await defaultSettings.save();

    return res.json({
      success: true,
      message: 'Settings reset to defaults',
      data: defaultSettings
    });
  } catch (error: any) {
    console.error('Error resetting settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset settings',
      error: error.message
    });
  }
});

export default router;
