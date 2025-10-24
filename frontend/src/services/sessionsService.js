/**
 * Sessions Service - Frontend service for scheduling and managing support sessions
 * Handles creating, retrieving, and joining support sessions
 */
import api from './api';

class SessionsService {
  // Schedule a new support session
  async scheduleSession(sessionData) {
    try {
      const response = await api.post('/api/sessions', sessionData);
      return response.data;
    } catch (error) {
      console.error('[SessionsService] Error scheduling session:', error);
      throw error;
    }
  }

  // Get sessions for a specific group
  async getGroupSessions(groupId) {
    try {
      const response = await api.get(`/api/sessions/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('[SessionsService] Error fetching group sessions:', error);
      throw error;
    }
  }

  // Join a scheduled session
  async joinSession(sessionId) {
    try {
      const response = await api.post(`/api/sessions/${sessionId}/join`);
      return response.data;
    } catch (error) {
      console.error('[SessionsService] Error joining session:', error);
      throw error;
    }
  }
}

export default new SessionsService();
