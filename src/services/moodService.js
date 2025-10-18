import api from './api';

// Demo mode flag
const DEMO_MODE = true;

class MoodService {
  // Create mood entry
  async createMood(value, note = '') {
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
    
    const result = await api.post('/api/moods', { value, note });
    return result.data;
  }

  // Get user's moods
  async getMoods(limit = 50) {
    if (DEMO_MODE) {
      // Demo mode - return sample moods
      return [
        { id: 1, value: 4, note: 'Feeling good today!', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        { id: 2, value: 3, note: 'Okay day', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
        { id: 3, value: 5, note: 'Great mood!', createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() }
      ];
    }
    
    const result = await api.get(`/api/moods?limit=${limit}`);
    return result.data;
  }

  // Get group moods
  async getGroupMoods(groupId, days = 7) {
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
  }
}

// Create and export a singleton instance
const moodService = new MoodService();

// Export individual functions for easier use
export const createMood = (value, note) => moodService.createMood(value, note);
export const getMoods = (range) => moodService.getMoods(range);
export const getGroupMoods = (groupId, days) => moodService.getGroupMoods(groupId, days);

export default moodService;