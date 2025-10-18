import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';

const ScheduledSessions = ({ groupId, showCreateButton = true }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    sessionType: 'check_in'
  });

  useEffect(() => {
    loadSessions();
  }, [groupId]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockSessions = [
        {
          id: 1,
          title: "Weekly Check-in",
          description: "Let's see how everyone is doing this week",
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          sessionType: 'check_in',
          createdBy: user.id,
          participants: ['user1', 'user2', user.id],
          status: 'scheduled'
        },
        {
          id: 2,
          title: "Mood Review Session",
          description: "Review our mood patterns and support each other",
          scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          sessionType: 'mood_review',
          createdBy: 'user1',
          participants: ['user1', 'user2', user.id],
          status: 'scheduled'
        },
        {
          id: 3,
          title: "Support Circle",
          description: "Open discussion for anyone needing extra support",
          scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          sessionType: 'support_session',
          createdBy: user.id,
          participants: ['user1', 'user2', user.id],
          status: 'completed'
        }
      ];
      setSessions(mockSessions);
    } catch (err) {
      setError('Failed to load sessions');
      console.error('Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const session = {
        ...newSession,
        id: Date.now(),
        scheduledDate: new Date(newSession.scheduledDate),
        createdBy: user.id,
        participants: [user.id], // Start with creator
        status: 'scheduled'
      };

      setSessions(prev => [session, ...prev]);
      setNewSession({
        title: '',
        description: '',
        scheduledDate: '',
        sessionType: 'check_in'
      });
      setShowCreateForm(false);
      
      // TODO: Send to backend API
      console.log('Creating session:', session);
      
    } catch (err) {
      setError('Failed to create session');
      console.error('Error creating session:', err);
    }
  };

  const handleJoinSession = async (sessionId) => {
    try {
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, participants: [...session.participants, user.id] }
          : session
      ));
      
      // TODO: Send to backend API
      console.log('Joining session:', sessionId);
      
    } catch (err) {
      setError('Failed to join session');
      console.error('Error joining session:', err);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionTypeIcon = (type) => {
    switch (type) {
      case 'check_in': return '📅';
      case 'mood_review': return '📊';
      case 'support_session': return '🤗';
      default: return '💬';
    }
  };

  const getSessionTypeColor = (type) => {
    switch (type) {
      case 'check_in': return 'bg-blue-100 text-blue-700';
      case 'mood_review': return 'bg-purple-100 text-purple-700';
      case 'support_session': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const isUpcoming = (date) => {
    return new Date(date) > new Date();
  };

  const isParticipant = (session) => {
    return session.participants.includes(user.id);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Scheduled Sessions</h3>
        {showCreateButton && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Schedule Session
          </button>
        )}
      </div>

      {/* Create Session Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h4 className="text-lg font-semibold mb-4">Create New Session</h4>
          <form onSubmit={handleCreateSession} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Title
              </label>
              <input
                type="text"
                value={newSession.title}
                onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., Weekly Check-in"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newSession.description}
                onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
                placeholder="Describe what this session is about..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newSession.scheduledDate}
                  onChange={(e) => setNewSession(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Type
                </label>
                <select
                  value={newSession.sessionType}
                  onChange={(e) => setNewSession(prev => ({ ...prev, sessionType: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="check_in">📅 Check-in</option>
                  <option value="mood_review">📊 Mood Review</option>
                  <option value="support_session">🤗 Support Session</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Create Session
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border">
            <div className="text-4xl mb-4">📅</div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">No sessions scheduled</h4>
            <p className="text-gray-500">Create your first group session to get started!</p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className={`bg-white p-4 rounded-lg border transition-all hover:shadow-md ${
                !isUpcoming(session.scheduledDate) ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">
                      {getSessionTypeIcon(session.sessionType)}
                    </span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{session.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSessionTypeColor(session.sessionType)}`}>
                          {session.sessionType.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{session.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>
                      <i className="fas fa-calendar mr-1"></i>
                      {formatDate(session.scheduledDate)}
                    </span>
                    <span>
                      <i className="fas fa-users mr-1"></i>
                      {session.participants.length} participants
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  {isUpcoming(session.scheduledDate) && (
                    <>
                      {!isParticipant(session) ? (
                        <button
                          onClick={() => handleJoinSession(session.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          Join Session
                        </button>
                      ) : (
                        <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm text-center">
                          Joined
                        </span>
                      )}
                    </>
                  )}
                  
                  {session.status === 'active' && (
                    <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm">
                      Enter Session
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

export default ScheduledSessions;

