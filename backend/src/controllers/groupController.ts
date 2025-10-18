import { Request, Response, NextFunction } from 'express';
import Group from '../models/Group';
import { AuthenticatedRequest } from '../types/express';

// POST /api/groups (protected): {name} → create with ownerId = req.user.id
export const createGroup = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body as unknown as { name: string };
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const group = await Group.create({
      name,
      owner: req.user.id,
      members: [req.user.id] // Add owner as first member
    });

    return res.status(201).json({
      _id: group._id,
      name: group.name,
      owner: group.owner,
      members: group.members
    });
  } catch (error) {
    console.error('Create group error:', error);
    return res.status(500).json({ message: 'Failed to create group' });
  }
};

// GET /api/groups/mine (protected): list groups where user is owner or member
export const getUserGroups = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const groups = await Group.find({
      $or: [
        { owner: req.user.id },
        { members: req.user.id }
      ]
    }).populate('owner', 'firstName lastName email')
      .populate('members', 'firstName lastName email');

    return res.status(200).json(groups);
  } catch (error) {
    console.error('Get user groups error:', error);
    return res.status(500).json({ message: 'Failed to get groups' });
  }
};
