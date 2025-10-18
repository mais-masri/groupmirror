import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { 
  UpdateUserSchema,
  AuthenticatedRequest,
  ApiResponse
} from '../models';
import { 
  ValidationError, 
  AuthenticationError, 
  NotFoundError,
  asyncHandler,
  sendSuccessResponse,
  validateRequest
} from '../utils/errors';

// Get user profile
export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = await userService.getPublicUser(req.user.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const response: ApiResponse = {
    success: true,
    data: user,
    message: 'Profile retrieved successfully',
  };

  sendSuccessResponse(res, response.data, response.message);
});

// Update user profile
export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const validatedData = validateRequest(UpdateUserSchema, req.body);
  
  // Check if email or username is being changed and already exists
  if (validatedData.email) {
    const existingUserByEmail = await userService.findByEmail(validatedData.email);
    if (existingUserByEmail && existingUserByEmail.id !== req.user.userId) {
      throw new ValidationError('Email already exists');
    }
  }

  if (validatedData.username) {
    const existingUserByUsername = await userService.findByUsername(validatedData.username);
    if (existingUserByUsername && existingUserByUsername.id !== req.user.userId) {
      throw new ValidationError('Username already exists');
    }
  }

  const updatedUser = await userService.update(req.user.userId, validatedData);
  if (!updatedUser) {
    throw new NotFoundError('User not found');
  }

  const publicUser = await userService.getPublicUser(updatedUser.id);
  
  const response: ApiResponse = {
    success: true,
    data: publicUser,
    message: 'Profile updated successfully',
  };

  sendSuccessResponse(res, response.data, response.message);
});

// Get user statistics
export const getUserStats = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = await userService.getPublicUser(req.user.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Calculate user statistics
  const stats = {
    user: {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      memberSince: user.createdAt,
    },
    moodEntries: {
      total: 0, // TODO: Get from mood service
      thisWeek: 0,
      thisMonth: 0,
      streak: 0,
    },
    groups: {
      total: 0, // TODO: Get from group service
      owned: 0,
      joined: 0,
    },
    lastActivity: user.updatedAt,
  };

  const response: ApiResponse = {
    success: true,
    data: stats,
    message: 'User statistics retrieved successfully',
  };

  sendSuccessResponse(res, response.data, response.message);
});

// Delete user account
export const deleteAccount = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { password } = req.body;
  
  if (!password) {
    throw new ValidationError('Password is required to delete account');
  }

  // Verify password
  const user = await userService.findById(req.user.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isPasswordValid = await userService.authenticate(user.email, password);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid password');
  }

  // TODO: Delete associated data (mood entries, group memberships, etc.)
  // For now, just delete the user
  
  const success = await userService.delete(req.user.userId);
  if (!success) {
    throw new NotFoundError('User not found');
  }

  const response: ApiResponse = {
    success: true,
    message: 'Account deleted successfully',
  };

  sendSuccessResponse(res, response.data, response.message);
});

// Export user data
export const exportUserData = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const user = await userService.getPublicUser(req.user.userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  // TODO: Gather all user data (mood entries, group memberships, etc.)
  const exportData = {
    user: user,
    moodEntries: [], // TODO: Get from mood service
    groups: [], // TODO: Get from group service
    exportDate: new Date().toISOString(),
  };

  const response: ApiResponse = {
    success: true,
    data: exportData,
    message: 'User data exported successfully',
  };

  sendSuccessResponse(res, response.data, response.message);
});
