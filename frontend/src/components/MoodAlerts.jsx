import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Alert from './Alert';
import alertsService from '../services/alertsService';
import sessionsService from '../services/sessionsService';
import groupService from '../services/groupService';

const MoodAlerts = ({ groupId, onSupportRequest, showAllGroups = false }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMoodAlerts();
    // Set up polling for new alerts every 30 seconds
    const interval = setInterval(loadMoodAlerts, 30000);
    return () => clearInterval(interval);
  }, [groupId]);

  const loadMoodAlerts = async () => {
    try {
      setLoading(true);
      
      if (showAllGroups) {
        // Fetch real alerts from backend API
        const response = await alertsService.getMoodAlerts();
        if (response.success) {
          setAlerts(response.data);
        } else {
          throw new Error(response.message || 'Failed to load alerts');
        }
      } else {
        // For specific group, still use mock data for now
        const mockAlerts = [
          {
            id: 1,
            type: 'low_mood',
            userId: 'user1',
            userName: 'Sarah',
            message: 'Sarah is feeling down (2/5). She might need some support.',
            mood: 2,
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            isRead: false,
            priority: 'high',
            groupId: groupId || 'current-group',
            groupName: 'My Personal Group'
          },
          {
            id: 2,
            type: 'missed_check_in',
            userId: 'user2',
            userName: 'Mike',
            message: "Mike hasn't logged his mood in 3 days. Check in with him?",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: false,
            priority: 'medium',
            groupId: groupId || 'current-group',
            groupName: 'My Personal Group'
          },
          {
            id: 3,
            type: 'support_request',
            userId: 'user1',
            userName: 'Sarah',
            message: 'Sarah is requesting emotional support.',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            isRead: false,
            priority: 'urgent',
            groupId: groupId || 'current-group',
            groupName: 'My Personal Group'
          }
        ];
        
        setAlerts(mockAlerts);
      }
    } catch (error) {
      console.error('Error loading mood alerts:', error);
      // Fallback to empty array if API fails
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ));
      
      // TODO: Send to backend API
      console.log('Marking alert as read:', alertId);
      
    } catch (err) {
      console.error('Error marking alert as read:', err);
    }
  };

  const handleSupportUser = (alert) => {
    if (onSupportRequest) {
      onSupportRequest(alert);
    }
    
    // Navigate to Group Chat to offer support
    window.location.href = '/group-chat';
    
    // Mark as read when action is taken
    handleMarkAsRead(alert.id);
  };

  const handleScheduleSupportSession = async () => {
    try {
      // Get user's groups to determine which group to schedule for
      const groupsResponse = await groupService.getGroups();
      
      if (!groupsResponse.success || groupsResponse.data.length === 0) {
        alert('No groups found. Please create a group first.');
        return;
      }

      // Use the first group (or could show a modal to select group)
      const targetGroup = groupsResponse.data[0];
      
      // Create a quick support session for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(14, 0, 0, 0); // 2 PM tomorrow

      const sessionData = {
        title: 'Urgent Support Session',
        description: 'Scheduled support session to address current group needs',
        scheduledDate: tomorrow.toISOString(),
        sessionType: 'urgent_support',
        groupId: targetGroup._id
      };

      const response = await sessionsService.scheduleSession(sessionData);
      
      if (response.success) {
        alert(`Support session scheduled successfully for ${targetGroup.name}!\n\nDate: ${tomorrow.toLocaleDateString()}\nTime: 2:00 PM\n\nAll group members will be notified.`);
      } else {
        throw new Error(response.message || 'Failed to schedule session');
      }

    } catch (error) {
      console.error('Error scheduling support session:', error);
      alert('Failed to schedule support session. Please try again.');
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'low_mood': return '😔';
      case 'missed_check_in': return '⏰';
      case 'group_mood_drop': return '📉';
      case 'support_request': return '🤗';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const top3Alerts = alerts.slice(0, 3);
  const unreadCount = top3Alerts.filter(alert => !alert.isRead).length;
  const urgentAlerts = top3Alerts.filter(alert => alert.priority === 'urgent' && !alert.isRead);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-800">Mood Alerts</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {urgentAlerts.length > 0 && (
          <button
            onClick={handleScheduleSupportSession}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Schedule Support Session
          </button>
        )}
      </div>

      {/* Urgent Alerts Banner */}
      {urgentAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
            <div>
              <h4 className="font-semibold text-red-800">
                {urgentAlerts.length} urgent alert{urgentAlerts.length > 1 ? 's' : ''} need attention
              </h4>
              <p className="text-red-600 text-sm">
                Someone in your group needs immediate support
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {top3Alerts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border">
            <div className="text-4xl mb-4">✅</div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">All good!</h4>
            <p className="text-gray-500">No alerts at the moment. Your group is doing well!</p>
          </div>
        ) : (
          top3Alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white border rounded-lg p-4 transition-all ${
                !alert.isRead 
                  ? 'border-l-4 border-l-indigo-500 shadow-sm' 
                  : 'border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-2xl">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                        {alert.priority}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(alert.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-gray-800 text-sm mb-2">{alert.message}</p>
                    
                    {alert.mood && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">Current mood:</span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                          {alert.mood}/5
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {!alert.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Mark as read
                    </button>
                  )}
                  
                  {(alert.type === 'low_mood' || alert.type === 'support_request') && (
                    <button
                      onClick={() => handleSupportUser(alert)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                    >
                      <i className="fas fa-hands-helping mr-1"></i>
                      Offer Support
                    </button>
                  )}
                  
                  {alert.type === 'missed_check_in' && (
                    <button
                      onClick={() => handleSupportUser(alert)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                    >
                      <i className="fas fa-comment mr-1"></i>
                      Check In
                    </button>
                  )}
                  
                  {alert.type === 'group_mood_drop' && (
                    <button
                      onClick={handleScheduleSupportSession}
                      className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
                    >
                      <i className="fas fa-users mr-1"></i>
                      Group Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MoodAlerts;
