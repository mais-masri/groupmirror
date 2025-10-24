/**
 * Alerts Service - Frontend service for fetching real mood alerts
 * Handles retrieving alerts based on actual database data
 */
import api from './api';

class AlertsService {
  // Get real mood alerts from backend
  async getMoodAlerts() {
    try {
      const response = await api.get('/api/alerts');
      return response.data;
    } catch (error) {
      console.error('[AlertsService] Error fetching mood alerts:', error);
      throw error;
    }
  }
}

export default new AlertsService();
