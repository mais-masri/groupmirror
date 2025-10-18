import api from './api';

// Demo mode flag
const DEMO_MODE = true;

class GroupService {
  // Create group
  async createGroup(name) {
    if (DEMO_MODE) {
      // Demo mode - simulate successful group creation
      const demoGroup = {
        _id: 'demo-group-' + Date.now(),
        name,
        description: 'Demo support group',
        members: [{ name: 'You' }],
        createdAt: new Date().toISOString(),
        inviteCode: 'DEMO2024'
      };
      return demoGroup;
    }
    
    const result = await api.post('/api/groups', { name });
    return result.data;
  }

  // Get user's groups
  async getUserGroups() {
    if (DEMO_MODE) {
      // Demo mode - return sample group
      return [{
        _id: 'demo-group-1',
        name: 'Demo Support Group',
        description: 'Our close-knit group for mutual support and mood tracking',
        members: [
          { name: 'Sarah', role: 'Member' },
          { name: 'Mike', role: 'Member' },
          { name: 'Alex', role: 'Member' }
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        moodCount: 25,
        inviteCode: 'SUPPORT2024'
      }];
    }
    
    const result = await api.get('/api/groups/mine');
    return result.data;
  }

  // Get group members
  async getGroupMembers(groupId) {
    if (DEMO_MODE) {
      // Demo mode - return sample members
      return [
        { id: 'user1', name: 'Sarah' },
        { id: 'user2', name: 'Mike' },
        { id: 'user3', name: 'Alex' }
      ];
    }
    
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