/**
 * ScheduledSessions - Shows upcoming group support sessions
 * Simple interface to view and join scheduled check-ins and mood reviews
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ScheduledSessions = ({ groupId }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [groupId]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      
      // Simple mock data - replace with real API when ready
      const mockSessions = [
        {
          id: 1,
          title: "Weekly Check-in",
          description: "Let's see how everyone is doing this week",
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          participants: 3,
          status: 'scheduled'
        },
        {
          id: 2,
          title: "Mood Review Session", 
          description: "Review our mood patterns and support each other",
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          participants: 3,
          status: 'scheduled'
        }
      ];
      
      setSessions(mockSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Scheduled Sessions</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Scheduled Sessions</h3>
        <span className="text-sm text-gray-500">{sessions.length} upcoming</span>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📅</div>
          <p className="text-gray-500">No sessions scheduled</p>
          <p className="text-sm text-gray-400 mt-1">Group sessions will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-1">{session.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <i className="fas fa-calendar-alt mr-1"></i>
                      {formatDate(session.scheduledDate)}
                    </span>
                    <span className="flex items-center">
                      <i className="fas fa-users mr-1"></i>
                      {session.participants} participants
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                  <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledSessions;