import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Mock user storage (in-memory for demo)
const mockUsers: any[] = [];

// Register new user
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user already exists in mock storage
    const existingUser = mockUsers.find(user => user.email === email);
    
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Create mock user
    const mockUser = {
      _id: `mock_${Date.now()}`,
      username: email,
      email: email,
      password: 'hashed_password', // Skip actual hashing for demo
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || '',
      createdAt: new Date()
    };

    mockUsers.push(mockUser);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: mockUser._id,
        email: mockUser.email,
        username: mockUser.username 
      },
      process.env.JWT_SECRET || 'demo-secret',
      { expiresIn: '7d' }
    );

    // Return 201 with { user:{_id,name,email}, token } (no password)
    return res.status(201).json({
      user: {
        _id: mockUser._id,
        name: `${mockUser.firstName} ${mockUser.lastName}`.trim(),
        email: mockUser.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

// Login user
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  try {
    // Find user in mock storage
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // For demo purposes, accept any password
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        username: user.username 
      },
      process.env.JWT_SECRET || 'demo-secret',
      { expiresIn: '7d' }
    );

    // Return 200 with { user, token } on success
    return res.status(200).json({
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

// Get current user profile
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Failed to get profile' });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, username } = req.body as { firstName?: string; lastName?: string; username?: string };
    
    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (username) updateData.username = username;

    const updatedUser = await User.findByIdAndUpdate(
      req.user!.id, 
      updateData, 
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      user: {
        _id: updatedUser._id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Failed to update profile' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body as unknown as { currentPassword: string; newPassword: string };
    
    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user!.id, { password: passwordHash });

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ message: 'Failed to change password' });
  }
};

// Verify token middleware
export const verifyTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    
    // Attach user to request
    req.user = {
      id: decoded.userId
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
