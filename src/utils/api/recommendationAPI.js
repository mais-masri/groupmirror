/**
 * Mock API service for recommendation endpoints
 * In a production app, these would be real HTTP requests to the backend
 */

import recommendationService from '../recommendationService';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user database
const mockUsers = {
  'user-1': {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    moodHistory: [
      { mood: '😊', date: '2024-01-20T10:00:00Z', note: 'Great morning meeting' },
      { mood: '😐', date: '2024-01-19T15:00:00Z', note: 'Busy day' },
      { mood: '😔', date: '2024-01-18T09:00:00Z', note: 'Project stress' },
      { mood: '🙂', date: '2024-01-17T14:00:00Z', note: 'Better today' },
      { mood: '😊', date: '2024-01-16T11:00:00Z', note: 'Team lunch was fun' }
    ],
    groups: ['Engineering Team', 'Project Alpha'],
    preferences: {
      notifications: true,
      recommendationFrequency: 'daily'
    }
  }
};

class RecommendationAPI {
  /**
   * Get recommendations for a specific user
   * @param {string} userId - User ID
   * @returns {Promise} Recommendation data
   */
  async getUserRecommendations(userId) {
    await delay(500); // Simulate network delay
    
    const user = mockUsers[userId] || mockUsers['user-1'];
    const result = recommendationService.processUserDataForRecommendations(user);
    
    return {
      success: true,
      data: {
        userId: user.id,
        recommendations: result.recommendations,
        insights: result.insights,
        analysis: result.analysis,
        generatedAt: result.generatedAt
      }
    };
  }

  /**
   * Get recommendation history for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options (limit, offset, etc.)
   * @returns {Promise} Historical recommendations
   */
  async getRecommendationHistory(userId, options = {}) {
    await delay(300);
    
    const { limit = 10, offset = 0 } = options;
    
    // Mock historical recommendations
    const history = Array.from({ length: limit }, (_, i) => ({
      id: `rec-${offset + i}`,
      date: new Date(Date.now() - (offset + i) * 24 * 60 * 60 * 1000).toISOString(),
      type: ['activity', 'social', 'mindfulness'][Math.floor(Math.random() * 3)],
      title: `Recommendation ${offset + i + 1}`,
      completed: Math.random() > 0.5,
      effectiveness: Math.floor(Math.random() * 5) + 1
    }));
    
    return {
      success: true,
      data: {
        history,
        total: 50,
        hasMore: offset + limit < 50
      }
    };
  }

  /**
   * Mark a recommendation as completed
   * @param {string} recommendationId - Recommendation ID
   * @param {Object} feedback - User feedback data
   * @returns {Promise} Success status
   */
  async markRecommendationCompleted(recommendationId, feedback = {}) {
    await delay(200);
    
    return {
      success: true,
      data: {
        recommendationId,
        completedAt: new Date().toISOString(),
        feedback
      }
    };
  }

  /**
   * Skip or dismiss a recommendation
   * @param {string} recommendationId - Recommendation ID
   * @param {string} reason - Reason for skipping
   * @returns {Promise} Success status
   */
  async skipRecommendation(recommendationId, reason = '') {
    await delay(200);
    
    return {
      success: true,
      data: {
        recommendationId,
        skippedAt: new Date().toISOString(),
        reason
      }
    };
  }

  /**
   * Get aggregated insights for a team/group
   * @param {string} groupId - Group ID
   * @returns {Promise} Group insights data
   */
  async getGroupInsights(groupId) {
    await delay(400);
    
    // Mock group data
    const groupMembers = [
      { id: 'user-1', name: 'John', avgMood: 3.5 },
      { id: 'user-2', name: 'Sarah', avgMood: 4.2 },
      { id: 'user-3', name: 'Mike', avgMood: 2.8 },
      { id: 'user-4', name: 'Alex', avgMood: 3.9 }
    ];
    
    const avgGroupMood = groupMembers.reduce((sum, m) => sum + m.avgMood, 0) / groupMembers.length;
    
    return {
      success: true,
      data: {
        groupId,
        groupName: 'Engineering Team',
        memberCount: groupMembers.length,
        averageMood: avgGroupMood.toFixed(1),
        moodTrend: avgGroupMood > 3 ? 'positive' : 'needs attention',
        topRecommendations: [
          {
            type: 'group',
            title: 'Team Building Activity',
            description: 'Consider organizing a team lunch or virtual coffee break',
            priority: 'medium'
          },
          {
            type: 'support',
            title: 'Check-in with Team',
            description: 'Some team members may benefit from 1-on-1 support',
            priority: 'high'
          }
        ],
        members: groupMembers
      }
    };
  }

  /**
   * Update user preferences for recommendations
   * @param {string} userId - User ID
   * @param {Object} preferences - Updated preferences
   * @returns {Promise} Success status
   */
  async updateRecommendationPreferences(userId, preferences) {
    await delay(200);
    
    // Update mock user preferences
    if (mockUsers[userId]) {
      mockUsers[userId].preferences = {
        ...mockUsers[userId].preferences,
        ...preferences
      };
    }
    
    return {
      success: true,
      data: {
        userId,
        preferences: mockUsers[userId]?.preferences || preferences
      }
    };
  }

  /**
   * Get recommendation statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise} Statistics data
   */
  async getRecommendationStats(userId) {
    await delay(300);
    
    return {
      success: true,
      data: {
        totalRecommendations: 156,
        completedRecommendations: 98,
        skippedRecommendations: 23,
        successRate: 0.63,
        avgEffectiveness: 3.8,
        mostEffectiveType: 'mindfulness',
        streaks: {
          current: 5,
          longest: 12
        },
        improvements: {
          moodScore: '+24%',
          stability: '+15%',
          engagement: '+32%'
        }
      }
    };
  }

  /**
   * Submit feedback on recommendations
   * @param {string} userId - User ID
   * @param {Object} feedbackData - Feedback details
   * @returns {Promise} Success status
   */
  async submitFeedback(userId, feedbackData) {
    await delay(200);
    
    return {
      success: true,
      data: {
        feedbackId: `feedback-${Date.now()}`,
        userId,
        submittedAt: new Date().toISOString(),
        ...feedbackData
      }
    };
  }
}

// Export singleton instance
const recommendationAPI = new RecommendationAPI();
export default recommendationAPI;

// Also export the class for testing
export { RecommendationAPI };