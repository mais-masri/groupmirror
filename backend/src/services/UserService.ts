import { User, CreateUser, UpdateUser, PublicUser } from '../models/User';
import { BaseServiceImpl } from './BaseService';
import { hashPassword, comparePassword } from '../utils/auth';
import { ValidationError } from '../utils/errors';

export interface UserService {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  authenticate(email: string, password: string): Promise<User | null>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean>;
  updateLastLogin(userId: string): Promise<void>;
  getPublicUser(userId: string): Promise<PublicUser | null>;
}

export class UserServiceImpl extends BaseServiceImpl<User> implements UserService {
  constructor() {
    super('users.json');
  }

  validateCreate(data: Partial<User>): User {
    const { email, username, password, firstName, lastName } = data;
    
    if (!email || !username || !password || !firstName || !lastName) {
      throw new ValidationError('Missing required fields');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationError('Invalid email format');
    }

    if (username.length < 3 || username.length > 30) {
      throw new ValidationError('Username must be between 3 and 30 characters');
    }

    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    return {
      id: '', // Will be set in create method
      email,
      username,
      password,
      firstName,
      lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;
  }

  validateUpdate(data: Partial<User>): Partial<User> {
    const validated: Partial<User> = {};

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (data.username && (data.username.length < 3 || data.username.length > 30)) {
      throw new ValidationError('Username must be between 3 and 30 characters');
    }

    if (data.password && data.password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters');
    }

    if (data.firstName) validated.firstName = data.firstName;
    if (data.lastName) validated.lastName = data.lastName;
    if (data.email) validated.email = data.email;
    if (data.username) validated.username = data.username;
    if (data.password) validated.password = data.password;

    validated.updatedAt = new Date();
    return validated;
  }

  async create(data: Partial<User>): Promise<User> {
    const validatedData = this.validateCreate(data);
    
    // Check if email or username already exists
    const existingUser = await this.findByEmail(validatedData.email) || 
                        await this.findByUsername(validatedData.username);
    
    if (existingUser) {
      throw new ValidationError('User with this email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);
    
    const newUser = {
      ...validatedData,
      id: this.generateId(),
      password: hashedPassword,
    };

    this.data.push(newUser);
    await this.saveData();
    return newUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findByField('email', email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findByField('username', username);
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return null;

    await this.updateLastLogin(user.id);
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) return false;

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) return false;

    const hashedNewPassword = await hashPassword(newPassword);
    await this.update(userId, { password: hashedNewPassword });
    return true;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, { updatedAt: new Date() });
  }

  async getPublicUser(userId: string): Promise<PublicUser | null> {
    const user = await this.findById(userId);
    if (!user) return null;

    const { password, ...publicUser } = user;
    return publicUser;
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Singleton instance
export const userService = new UserServiceImpl();
