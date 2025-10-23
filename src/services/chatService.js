/**
 * Chat Service - Frontend service for group chat functionality
 * Handles sending and retrieving chat messages
 */
import api from './api';

class ChatService {
  // Get messages for a specific group
  async getGroupMessages(groupId, limit = 50, offset = 0) {
    try {
      const response = await api.get(`/api/chat/${groupId}/messages`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('[ChatService] Error fetching group messages:', error);
      throw error;
    }
  }

  // Send a message to a group
  async sendMessage(groupId, content, messageType = 'text') {
    try {
      const response = await api.post(`/api/chat/${groupId}/messages`, {
        content,
        messageType
      });
      return response.data;
    } catch (error) {
      console.error('[ChatService] Error sending message:', error);
      throw error;
    }
  }
}

export default new ChatService();
