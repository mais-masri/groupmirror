/**
 * Alerts Routes - API endpoints for fetching real mood-related alerts
 * Handles retrieving urgent, high, and medium priority alerts based on actual mood data
 */
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Mood from '../models/Mood';
import Group from '../models/Group';
import User from '../models/User';

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

// GET /api/alerts - Get real mood alerts based on actual database data
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User ID not found in token' });
    }

    // Find all groups the user is a member or admin of
    const userGroups = await Group.find({
      $or: [
        { adminId: userId },
        { members: userId }
      ],
      isActive: true
    }).populate('members', 'firstName lastName username');

    let allAlerts: any[] = [];
    const processedUsers = new Set<string>(); // Avoid duplicate alerts for same user

    for (const group of userGroups) {
      const groupName = group.name;
      const groupId = group._id.toString();

      for (const member of group.members as any[]) {
        if (member._id.toString() === userId) continue; // Don't alert about yourself
        if (processedUsers.has(member._id.toString())) continue; // Skip if already processed

        const memberId = member._id;
        const memberName = `${member.firstName} ${member.lastName}`.trim();

        // Check for Low Mood Alerts (based on TODAY'S mood only)
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

        const todaysMood = await Mood.findOne({
          userId: memberId,
          date: {
            $gte: startOfDay,
            $lt: endOfDay
          }
        }).sort({ createdAt: -1 });

        if (todaysMood && todaysMood.moodLevel <= 2) {
          // Only alert if they actually have a low mood TODAY
          const priority = todaysMood.moodLevel === 1 ? 'urgent' : 'high';
          allAlerts.push({
            id: new mongoose.Types.ObjectId().toString(),
            type: 'low_mood',
            userId: memberId.toString(),
            userName: memberName,
            groupId: groupId,
            groupName: groupName,
            message: `${memberName} is feeling ${todaysMood.moodLevel}/5 today. They might need some support.`,
            priority: priority,
            timestamp: todaysMood.createdAt,
            moodLevel: todaysMood.moodLevel,
          });
          processedUsers.add(memberId.toString());
        } else if (!todaysMood) {
          // Check for Missed Check-in (only if they haven't logged TODAY)
          const lastMood = await Mood.findOne({ userId: memberId }).sort({ createdAt: -1 });
          
          if (lastMood) {
            const daysSinceLastMood = Math.floor((Date.now() - lastMood.createdAt.getTime()) / (24 * 60 * 60 * 1000));
            
            if (daysSinceLastMood >= 2) { // Only alert if 2+ days without mood entry
              allAlerts.push({
                id: new mongoose.Types.ObjectId().toString(),
                type: 'missed_check_in',
                userId: memberId.toString(),
                userName: memberName,
                groupId: groupId,
                groupName: groupName,
                message: `${memberName} hasn't logged their mood in ${daysSinceLastMood} days. Check in with them?`,
                priority: 'medium',
                timestamp: lastMood.createdAt,
                daysMissed: daysSinceLastMood,
              });
              processedUsers.add(memberId.toString());
            }
          }
        }
      }
    }

    // Sort alerts by priority (urgent > high > medium) and then by timestamp
    allAlerts.sort((a, b) => {
      const priorityOrder = { 'urgent': 1, 'high': 2, 'medium': 3 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    // Limit to top 3 alerts only
    const top3Alerts = allAlerts.slice(0, 3);

    res.json({
      success: true,
      data: top3Alerts,
      count: top3Alerts.length
    });

  } catch (error: any) {
    console.error('Error fetching mood alerts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch mood alerts', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
