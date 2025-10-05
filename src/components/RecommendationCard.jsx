import React from 'react';

const RecommendationCard = ({ recommendation, priority = 'normal' }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-blue-300 bg-blue-50';
    }
  };

  const getTypeIcon = () => {
    switch (recommendation.type) {
      case 'activity':
        return '🎯';
      case 'social':
        return '👥';
      case 'mindfulness':
        return '🧘';
      case 'support':
        return '💝';
      case 'recovery':
        return '🌱';
      case 'motivation':
        return '⚡';
      case 'intervention':
        return '🆘';
      case 'group':
        return '👫';
      default:
        return '💡';
    }
  };

  return (
    <div className={`border-2 rounded-lg p-4 mb-4 ${getPriorityColor()} transition-all hover:shadow-md`}>
      <div className="flex items-start mb-3">
        <span className="text-2xl mr-3">{getTypeIcon()}</span>
        <h3 className="font-bold text-lg text-gray-800 flex-1">{recommendation.title}</h3>
      </div>
      
      <ul className="space-y-2">
        {recommendation.suggestions.slice(0, 3).map((suggestion, index) => (
          <li key={index} className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span className="text-gray-700 text-sm">{suggestion}</span>
          </li>
        ))}
      </ul>
      
      {recommendation.suggestions.length > 3 && (
        <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
          See {recommendation.suggestions.length - 3} more suggestions →
        </button>
      )}
    </div>
  );
};

export default RecommendationCard;