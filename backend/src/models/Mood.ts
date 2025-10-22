/**
 * Mood Model - Database schema for mood tracking entries
 * Stores user mood data with unique constraint (one mood per user per day)
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface IMood extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  moodType: 'Happy' | 'Motivated' | 'Neutral' | 'Sad' | 'Stressed';
  moodLevel: 1 | 2 | 3 | 4 | 5; // Corresponds to (1/5) to (5/5) in legend
  description?: string;
  date: Date; // The specific date the mood was recorded
}

const MoodSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moodType: {
      type: String,
      enum: ['Happy', 'Motivated', 'Neutral', 'Sad', 'Stressed'],
      required: true,
    },
    moodLevel: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: true,
    },
    description: {
      type: String,
      maxlength: 100,
    },
    date: {
      type: Date,
      required: true,
      index: true, // Index for efficient date-based queries
    },
  },
  { timestamps: true }
);

// Add a compound index to ensure a user can only record one mood per day
MoodSchema.index({ userId: 1, date: 1 }, { unique: true });

const Mood = mongoose.model<IMood>('Mood', MoodSchema);

export default Mood;