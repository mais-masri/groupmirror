/**
 * Custom React hook for managing recommendations
 * Provides a clean interface to fetch and manage user recommendations
 */

import { useState, useEffect, useCallback } from 'react';
import recommendationAPI from '../utils/api/recommendationAPI';

const useRecommendations = (userId = 'user-1', autoFetch = true) => {
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  // Fetch recommendations
  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await recommendationAPI.getUserRecommendations(userId);
      
      if (response.success) {
        setRecommendations(response.data.recommendations);
        setInsights(response.data.insights);
        setAnalysis(response.data.analysis);
      } else {
        setError('Failed to fetch recommendations');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch recommendation history
  const fetchHistory = useCallback(async (options = {}) => {
    try {
      const response = await recommendationAPI.getRecommendationHistory(userId, options);
      
      if (response.success) {
        setHistory(response.data.history);
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
    }
  }, [userId]);

  // Fetch recommendation statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await recommendationAPI.getRecommendationStats(userId);
      
      if (response.success) {
        setStats(response.data);
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch statistics');
    }
  }, [userId]);

  // Mark recommendation as completed
  const completeRecommendation = useCallback(async (recommendationId, feedback = {}) => {
    try {
      const response = await recommendationAPI.markRecommendationCompleted(recommendationId, feedback);
      
      if (response.success) {
        // Update local state
        setRecommendations(prev => 
          prev.filter(rec => rec.id !== recommendationId)
        );
        
        // Refresh stats
        await fetchStats();
        
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Failed to complete recommendation');
    }
  }, [fetchStats]);

  // Skip recommendation
  const skipRecommendation = useCallback(async (recommendationId, reason = '') => {
    try {
      const response = await recommendationAPI.skipRecommendation(recommendationId, reason);
      
      if (response.success) {
        // Update local state
        setRecommendations(prev => 
          prev.filter(rec => rec.id !== recommendationId)
        );
        
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Failed to skip recommendation');
    }
  }, []);

  // Update preferences
  const updatePreferences = useCallback(async (preferences) => {
    try {
      const response = await recommendationAPI.updateRecommendationPreferences(userId, preferences);
      
      if (response.success) {
        // Refresh recommendations with new preferences
        await fetchRecommendations();
        
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Failed to update preferences');
    }
  }, [userId, fetchRecommendations]);

  // Submit feedback
  const submitFeedback = useCallback(async (feedbackData) => {
    try {
      const response = await recommendationAPI.submitFeedback(userId, feedbackData);
      
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      setError(err.message || 'Failed to submit feedback');
    }
  }, [userId]);

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([
      fetchRecommendations(),
      fetchStats(),
      fetchHistory()
    ]);
  }, [fetchRecommendations, fetchStats, fetchHistory]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchRecommendations();
    }
  }, [autoFetch, fetchRecommendations]);

  return {
    // State
    recommendations,
    insights,
    analysis,
    stats,
    history,
    loading,
    error,
    
    // Actions
    fetchRecommendations,
    fetchHistory,
    fetchStats,
    completeRecommendation,
    skipRecommendation,
    updatePreferences,
    submitFeedback,
    refresh,
    
    // Computed values
    hasRecommendations: recommendations.length > 0,
    recommendationCount: recommendations.length,
    priorityRecommendations: recommendations.filter(rec => rec.priority === 'high')
  };
};

// Hook for group insights
export const useGroupInsights = (groupId) => {
  const [groupInsights, setGroupInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGroupInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await recommendationAPI.getGroupInsights(groupId);
      
      if (response.success) {
        setGroupInsights(response.data);
      } else {
        setError('Failed to fetch group insights');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      fetchGroupInsights();
    }
  }, [groupId, fetchGroupInsights]);

  return {
    groupInsights,
    loading,
    error,
    refresh: fetchGroupInsights
  };
};

export default useRecommendations;