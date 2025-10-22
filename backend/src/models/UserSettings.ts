/**
 * UserSettings Model - Database schema for user application settings
 * Stores essential user preferences for notifications, appearance, and privacy
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSettings extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  
  // Notification Settings
  pushNotifications: boolean;
  emailReminders: boolean;
  moodReminderTime: string; // Format: "HH:MM"
  weeklyReports: boolean;
  groupNotifications: boolean;
  
  // Appearance Settings
  theme: 'light' | 'dark';
  
  // Privacy Settings
  profileVisibility: 'public' | 'friends' | 'private';
  moodSharing: boolean;
  dataExport: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema: Schema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  
  // Notification Settings
  pushNotifications: { type: Boolean, default: true },
  emailReminders: { type: Boolean, default: true },
  moodReminderTime: { type: String, default: '20:00' },
  weeklyReports: { type: Boolean, default: true },
  groupNotifications: { type: Boolean, default: true },
  
  // Appearance Settings
  theme: { 
    type: String, 
    enum: ['light', 'dark'], 
    default: 'light' 
  },
  
  // Privacy Settings
  profileVisibility: { 
    type: String, 
    enum: ['public', 'friends', 'private'], 
    default: 'private' 
  },
  moodSharing: { type: Boolean, default: false },
  dataExport: { type: Boolean, default: true },
}, { 
  timestamps: true 
});

export default mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);
