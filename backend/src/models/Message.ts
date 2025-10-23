/**
 * Message Model - Database schema for group chat messages
 * Stores chat messages between group members
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  groupId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  content: string;
  messageType: 'text' | 'mood_share' | 'support_request';
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  messageType: {
    type: String,
    enum: ['text', 'mood_share', 'support_request'],
    default: 'text'
  }
}, { 
  timestamps: true 
});

// Index for efficient group message queries
MessageSchema.index({ groupId: 1, createdAt: -1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
