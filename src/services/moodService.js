/**
 * MoodService - Handles all mood tracking API calls
 * Creates, retrieves, and manages mood entries with date support
 */
import api from './api';

// Demo mode disabled - use real API
const DEMO_MODE = false;

class MoodService {
  // Create mood entry
  async createMood(value, note = '', customDate = null) {
    try {
      // Validate input
      if (!value || value < 1 || value > 5) {
        throw new Error('Mood value must be between 1 and 5');
      }

      if (DEMO_MODE) {
        // Demo mode - simulate successful mood creation
        const demoMood = {
          id: 'demo-mood-' + Date.now(),
          value,
          note,
          createdAt: new Date().toISOString(),
          userId: 'demo-user'
        };
        return demoMood;
      }
      
      // Map mood value to mood type and level
      const moodMapping = {
        1: { moodType: 'Stressed', moodLevel: 1 },
        2: { moodType: 'Sad', moodLevel: 2 },
        3: { moodType: 'Neutral', moodLevel: 3 },
        4: { moodType: 'Motivated', moodLevel: 4 },
        5: { moodType: 'Happy', moodLevel: 5 }
      };

      const { moodType, moodLevel } = moodMapping[value];
      
      // Prepare request data
      const requestData = { 
        moodType, 
        moodLevel, 
        description: note 
      };

      // Add custom date if provided
      if (customDate) {
        requestData.date = customDate.toISOString();
      }
      
      const result = await api.post('/api/moods', requestData);
      return result.data;
    } catch (error) {
      console.error('[MoodService] Error creating mood:', error);
      throw error;
    }
  }

  // Get user's moods
  async getMoods(year = null) {
    try {
      if (DEMO_MODE) {
        // Demo mode - return sample moods
        return [
          { id: 1, value: 4, note: 'Feeling good today!', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
          { id: 2, value: 3, note: 'Okay day', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
          { id: 3, value: 5, note: 'Great mood!', createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() }
        ];
      }
      
      let url = '/api/moods';
      if (year) {
        url += `?year=${year}`;
      }
      
      const result = await api.get(url);
      return result.data.data || [];
    } catch (error) {
      console.error('[MoodService] Error getting moods:', error);
      throw error;
    }
  }

  // Get group moods
  async getGroupMoods(groupId, days = 7) {
    try {
      if (!groupId) {
        throw new Error('Group ID is required');
      }

      if (DEMO_MODE) {
        // Demo mode - return sample group moods
        return [
          { id: 1, value: 4, note: 'Feeling good today!', user: { name: 'Sarah' }, createdAt: new Date().toISOString() },
          { id: 2, value: 3, note: 'Okay day', user: { name: 'Mike' }, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
          { id: 3, value: 5, note: 'Great mood!', user: { name: 'Alex' }, createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() }
        ];
      }
      
      const result = await api.get(`/api/groups/${groupId}/moods?days=${days}`);
      return result.data;
    } catch (error) {
      console.error('[MoodService] Error getting group moods:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const moodService = new MoodService();

// Export individual functions for easier use
export const createMood = (value, note) => moodService.createMood(value, note);
export const getMoods = (range) => moodService.getMoods(range);
export const getGroupMoods = (groupId, days) => moodService.getGroupMoods(groupId, days);

export default moodService;