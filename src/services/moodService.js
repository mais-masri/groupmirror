import api from './api';

class MoodService {
  // Create mood entry
  async createMood(value, note = '') {
    const result = await api.post('/api/moods', { value, note });
    return result.data;
  }

  // Get user's moods
  async getMoods(limit = 50) {
    const result = await api.get(`/api/moods?limit=${limit}`);
    return result.data;
  }

  // Get group moods
  async getGroupMoods(groupId, days = 7) {
    const result = await api.get(`/api/groups/${groupId}/moods?days=${days}`);
    return result.data;
  }
}

// Create and export a singleton instance
const moodService = new MoodService();

// Export individual functions for easier use
export const createMood = (value, note) => moodService.createMood(value, note);
export const getMoods = (range) => moodService.getMoods(range);
export const getGroupMoods = (groupId, days) => moodService.getGroupMoods(groupId, days);

export default moodService;