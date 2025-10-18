import Mood from "../models/Mood";

export const createMood = async (userId: string, value: number, note?: string) => {
  return await Mood.create({ userId, value, note });
};

export const listMoods = async (userId: string, limit = 50) => {
  return await Mood.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean();
};

// Export singleton instance
export const moodService = {
  createMood,
  listMoods
};