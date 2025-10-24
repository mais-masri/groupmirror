/**
 * GroupService - Handles all group management API calls
 * Creates groups, joins groups, manages members, and retrieves group data
 */
import { api } from './api';

class GroupService {
  // Get user's groups
  async getGroups() {
    try {
      const response = await api.get('/api/groups');
      return response.data;
    } catch (error) {
      console.error('[GroupService] Error fetching groups:', error);
      throw error;
    }
  }

  // Get specific group details
  async getGroup(groupId) {
    try {
      const response = await api.get(`/api/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('[GroupService] Error fetching group:', error);
      throw error;
    }
  }

  // Create new group
  async createGroup(groupData) {
    try {
      const response = await api.post('/api/groups', groupData);
      return response.data;
    } catch (error) {
      console.error('[GroupService] Error creating group:', error);
      throw error;
    }
  }

  // Join group with invite code
  async joinGroup(inviteCode) {
    try {
      const response = await api.post('/api/groups/join', { inviteCode });
      return response.data;
    } catch (error) {
      console.error('[GroupService] Error joining group:', error);
      throw error;
    }
  }

  // Leave group
  async leaveGroup(groupId) {
    try {
      const response = await api.post(`/api/groups/${groupId}/leave`);
      return response.data;
    } catch (error) {
      console.error('[GroupService] Error leaving group:', error);
      throw error;
    }
  }

  // Get group statistics
  async getGroupStats(groupId) {
    try {
      const response = await api.get(`/api/groups/${groupId}/stats`);
      return response.data;
    } catch (error) {
      console.error('[GroupService] Error fetching group stats:', error);
      throw error;
    }
  }

  // Get group moods - all mood entries from group members
  async getGroupMoods(groupId) {
    try {
      const response = await api.get(`/api/groups/${groupId}/moods`);
      return response.data;
    } catch (error) {
      console.error('[GroupService] Error fetching group moods:', error);
      throw error;
    }
  }
}

export default new GroupService();