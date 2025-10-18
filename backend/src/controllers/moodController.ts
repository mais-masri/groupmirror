import { Request, Response, NextFunction } from 'express';
import { createMood, listMoods } from '../services/MoodService';

export const createMoodHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { value, note } = req.body;
    
    const mood = await createMood(req.user!.id, value, note);

    return res.status(201).json({
      _id: mood._id,
      userId: mood.userId,
      value: mood.value,
      note: mood.note,
      createdAt: mood.createdAt
    });
  } catch (error) {
    console.error('Create mood error:', error);
    return res.status(500).json({ message: 'Failed to create mood' });
  }
};

export const listMoodsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit as string) : 50;
    
    const moods = await listMoods(req.user!.id, limitNum);

    return res.status(200).json(moods);
  } catch (error) {
    console.error('Get moods error:', error);
    return res.status(500).json({ message: 'Failed to get moods' });
  }
};
