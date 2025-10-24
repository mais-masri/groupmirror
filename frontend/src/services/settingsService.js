/**
 * SettingsService - Handles user application settings API calls
 * Manages user preferences for notifications, appearance, privacy, and theme settings
 */
import { api } from './api';

class SettingsService {
  // Get user settings
  async getSettings() {
    try {
      const response = await api.get('/api/settings');
      return response.data;
    } catch (error) {
      console.error('[SettingsService] Error fetching settings:', error);
      throw error;
    }
  }

  // Update user settings
  async updateSettings(settingsData) {
    try {
      const response = await api.put('/api/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('[SettingsService] Error updating settings:', error);
      throw error;
    }
  }

  // Reset settings to defaults
  async resetSettings() {
    try {
      const response = await api.post('/api/settings/reset');
      return response.data;
    } catch (error) {
      console.error('[SettingsService] Error resetting settings:', error);
      throw error;
    }
  }
}

const settingsService = new SettingsService();
export default settingsService;
