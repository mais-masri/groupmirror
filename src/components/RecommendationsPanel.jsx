import React, { useState, useEffect } from 'react';
import RecommendationCard from './RecommendationCard';
import recommendationService from '../utils/recommendationService';

const RecommendationsPanel = ({ userData = null, className = '' }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priority, setPriority] = useState('normal');

  useEffect(() => {
    // Process user data and generate recommendations
    const generateRecommendations = () => {
      setLoading(true);
      
      // Mock user data if not provided
      const mockUserData = userData || {
        moodHistory: [
          { mood: '😊', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
          { mood: '😐', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { mood: '😔', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
          { mood: '😐', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { mood: '🙂', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { mood: '😊', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
          { mood: '😀', date: new Date() }
        ],
        groups: ['Engineering Team', 'Project Alpha'],
        preferences: {
          notifications: true,
          privateMode: false
        }
      };

      // Process data for recommendations
      const result = recommendationService.processUserDataForRecommendations(mockUserData);
      
      setRecommendations(result.recommendations);
      setInsights(result.insights);
      
      // Set priority based on priority score
      if (result.priorityScore >= 70) {
        setPriority('high');
      } else if (result.priorityScore >= 40) {
        setPriority('medium');
      } else {
        setPriority('low');
      }
      
      setLoading(false);
    };

    // Simulate async data loading
    const timer = setTimeout(generateRecommendations, 500);
    return () => clearTimeout(timer);
  }, [userData]);

  const getMoodTrendIcon = (trend) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '❓';
    }
  };

  const getMoodCategoryBadge = (category) => {
    const badges = {
      positive: { text: 'Positive', className: 'bg-green-100 text-green-800' },
      neutral: { text: 'Neutral', className: 'bg-gray-100 text-gray-800' },
      negative: { text: 'Needs Attention', className: 'bg-red-100 text-red-800' }
    };
    
    const badge = badges[category] || badges.neutral;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Insights Panel */}
      {insights && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Mood Insights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">Mood Trend</div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getMoodTrendIcon(insights.moodTrend)}</span>
                <span className="font-semibold capitalize">{insights.moodTrend}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">Average Mood</div>
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-2">{insights.averageMood}</span>
                <span className="text-sm text-gray-500">/ 5.0</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 mb-1">Stability Score</div>
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-2">{insights.moodStability}%</span>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${insights.moodStability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Overall Status:</span>
              {getMoodCategoryBadge(insights.dominantMoodCategory)}
            </div>
            
            {insights.streaks && insights.streaks.currentPositiveStreak > 0 && (
              <div className="text-sm">
                <span className="text-green-600 font-medium">
                  🔥 {insights.streaks.currentPositiveStreak} day positive streak!
                </span>
              </div>
            )}
          </div>
          
          {insights.bestDays && insights.bestDays.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-2">Your Best Days:</div>
              <div className="flex space-x-2">
                {insights.bestDays.map((day, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium"
                  >
                    {day.day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Personalized Recommendations</h2>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Refresh ↻
          </button>
        </div>
        
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard 
                key={index} 
                recommendation={rec} 
                priority={priority}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl mb-3 block">🌟</span>
            <p className="text-gray-600">
              Keep tracking your mood to get personalized recommendations!
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            View All Recommendations
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            Customize Preferences
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            Export Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPanel;