/**
 * Group Model - Database schema for mood tracking groups
 * Stores group information for mutual support and mood sharing
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description: string;
  adminId: mongoose.Schema.Types.ObjectId;
  members: mongoose.Schema.Types.ObjectId[];
  inviteCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 100 
  },
  description: { 
    type: String, 
    trim: true, 
    maxlength: 500 
  },
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  inviteCode: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
}, { 
  timestamps: true 
});

// Ensure invite code is unique
GroupSchema.index({ inviteCode: 1 }, { unique: true });

export default mongoose.model<IGroup>('Group', GroupSchema);