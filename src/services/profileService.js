/**
 * ProfileService - Handles all profile management API calls
 * Gets, updates user profile information and statistics
 */
import api from './api';

class ProfileService {
  // Get user profile
  async getProfile() {
    try {
      const result = await api.get('/api/profile');
      return result.data;
    } catch (error) {
      console.error('[ProfileService] Error getting profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const result = await api.put('/api/profile', profileData);
      return result.data;
    } catch (error) {
      console.error('[ProfileService] Error updating profile:', error);
      throw error;
    }
  }

  // Get user statistics
  async getProfileStats() {
    try {
      const result = await api.get('/api/profile/stats');
      return result.data;
    } catch (error) {
      console.error('[ProfileService] Error getting profile stats:', error);
      throw error;
    }
  }
}

export default new ProfileService();
