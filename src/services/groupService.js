import api from './api';

class GroupService {
  // Create group
  async createGroup(name) {
    const result = await api.post('/api/groups', { name });
    return result.data;
  }

  // Get user's groups
  async getUserGroups() {
    const result = await api.get('/api/groups/mine');
    return result.data;
  }

  // Get group members
  async getGroupMembers(groupId) {
    const result = await api.get(`/api/groups/${groupId}/members`);
    return result.data;
  }
}

// Create and export a singleton instance
const groupService = new GroupService();

// Export individual functions for easier use
export const createGroup = (name) => groupService.createGroup(name);
export const getUserGroups = () => groupService.getUserGroups();
export const getGroupMembers = (groupId) => groupService.getGroupMembers(groupId);

export default groupService;