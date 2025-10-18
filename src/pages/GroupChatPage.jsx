import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getGroupMoods } from '../services/moodService';
import { getGroupMembers } from '../services/groupService';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const GroupChatPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [recentMoods, setRecentMoods] = useState([]);
  const [messageType, setMessageType] = useState('text'); // text, mood_share, support_request
  const [selectedGroup, setSelectedGroup] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadChatData = async () => {
      try {
        setLoading(true);
        
        // For demo purposes, create a mock group since API might be down
        const mockGroup = {
          id: 'demo-group-1',
          name: 'Demo Support Group',
          members: ['user1', 'user2', 'user3']
        };
        
        setSelectedGroup(mockGroup);
        setGroupMembers([
          { id: 'user1', name: 'Sarah' },
          { id: 'user2', name: 'Mike' },
          { id: 'user3', name: 'Alex' }
        ]);

        // Mock recent moods
        setRecentMoods([
          { userId: user?.id, mood: 4, notes: 'Feeling good today', date: new Date() },
          { userId: 'user1', mood: 3, notes: 'Okay day', date: new Date() },
          { userId: 'user2', mood: 5, notes: 'Great mood!', date: new Date() }
        ]);

        // Load chat messages (mock data for demo)
        const mockMessages = [
          {
            id: 1,
            userId: user?.id || 'current-user',
            userName: user?.name || 'You',
            content: "Good morning everyone! How are we all feeling today?",
            messageType: 'text',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            moodData: null
          },
          {
            id: 2,
            userId: 'user1',
            userName: 'Sarah',
            content: "I'm feeling a bit anxious today but trying to stay positive 😊",
            messageType: 'mood_share',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            moodData: { mood: 3, notes: 'Feeling anxious but staying positive' }
          },
          {
            id: 3,
            userId: 'user2',
            userName: 'Mike',
            content: "Hey Sarah, I understand that feeling. Want to talk about what's on your mind?",
            messageType: 'text',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            moodData: null
          }
        ];

        setMessages(mockMessages);
      } catch (err) {
        setError('Failed to load chat data - using demo mode');
        console.error('Error loading chat:', err);
        
        // Set demo data even if there's an error
        const mockGroup = {
          id: 'demo-group-1',
          name: 'Demo Support Group'
        };
        setSelectedGroup(mockGroup);
        setGroupMembers([
          { id: 'user1', name: 'Sarah' },
          { id: 'user2', name: 'Mike' },
          { id: 'user3', name: 'Alex' }
        ]);
        setMessages([
          {
            id: 1,
            userId: user?.id || 'current-user',
            userName: user?.name || 'You',
            content: "Welcome to Group Chat! This is demo mode.",
            messageType: 'text',
            timestamp: new Date(),
            moodData: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup) return;

    try {
      const message = {
        id: Date.now(),
        userId: user.id,
        userName: user.name,
        content: newMessage.trim(),
        messageType,
        timestamp: new Date(),
        moodData: messageType === 'mood_share' ? getCurrentUserMood() : null
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // TODO: Send to backend API
      console.log('Sending message:', message);
      
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  const getCurrentUserMood = () => {
    const todayMood = recentMoods.find(mood => 
      mood.userId === user.id && 
      new Date(mood.date).toDateString() === new Date().toDateString()
    );
    return todayMood || null;
  };

  const handleMoodShare = () => {
    const currentMood = getCurrentUserMood();
    if (!currentMood) {
      setError('Please log your mood first before sharing');
      return;
    }
    
    setMessageType('mood_share');
    setNewMessage(`I'm feeling ${currentMood.mood}/5 today. ${currentMood.notes || ''}`);
  };

  const handleSupportRequest = () => {
    setMessageType('support_request');
    setNewMessage('I could use some support right now...');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMoodEmoji = (mood) => {
    const emojis = ['😢', '😔', '😐', '🙂', '😊', '😄'];
    return emojis[mood] || '😐';
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'mood_share': return '😊';
      case 'support_request': return '🤗';
      default: return '💬';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!selectedGroup) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 flex flex-col h-screen">
          {error && (
            <div className="p-4 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                <span className="text-sm text-yellow-800">
                  Demo Mode: {error} You can still test the chat features!
                </span>
              </div>
            </div>
          )}
          
          {/* Chat Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{selectedGroup.name} Chat</h1>
                  <p className="text-sm text-gray-600">
                    {groupMembers.length} members • Real-time support
                  </p>
                </div>
            <div className="flex space-x-2">
              <button
                onClick={handleMoodShare}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                title="Share your current mood"
              >
                <i className="fas fa-smile mr-2"></i>
                Share Mood
              </button>
              <button
                onClick={handleSupportRequest}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                title="Request support from the group"
              >
                <i className="fas fa-hands-helping mr-2"></i>
                Need Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Start the conversation!</h3>
            <p className="text-gray-500">Be the first to share how you're feeling with your group.</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.userId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.userId === user.id
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white shadow-sm border'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">
                    {getMessageTypeIcon(message.messageType)}
                  </span>
                  <span className="font-semibold text-sm">
                    {message.userId === user.id ? 'You' : message.userName}
                  </span>
                  <span className="text-xs opacity-70 ml-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {message.moodData && (
                  <div className="mt-2 pt-2 border-t border-opacity-20">
                    <div className="flex items-center text-sm">
                      <span className="mr-2">Mood:</span>
                      <span className="text-lg mr-1">
                        {getMoodEmoji(message.moodData.mood)}
                      </span>
                      <span className="font-semibold">{message.moodData.mood}/5</span>
                    </div>
                    {message.moodData.notes && (
                      <p className="text-xs opacity-80 mt-1 italic">
                        "{message.moodData.notes}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={() => setMessageType('text')}
                className={`px-3 py-1 rounded-full text-sm ${
                  messageType === 'text'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                💬 Text
              </button>
              <button
                onClick={() => setMessageType('mood_share')}
                className={`px-3 py-1 rounded-full text-sm ${
                  messageType === 'mood_share'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                😊 Mood Share
              </button>
              <button
                onClick={() => setMessageType('support_request')}
                className={`px-3 py-1 rounded-full text-sm ${
                  messageType === 'support_request'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                🤗 Support
              </button>
            </div>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                messageType === 'mood_share' 
                  ? "Share your current mood with the group..."
                  : messageType === 'support_request'
                  ? "What kind of support do you need?"
                  : "Type your message..."
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows="2"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GroupChatPage;
