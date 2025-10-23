/**
 * GroupChatPage - Real-time group chat where members can send messages and offer support
 * Shows messages from all group members with proper user identification
 */
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import groupService from '../services/groupService';
import chatService from '../services/chatService';

const GroupChatPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('group');
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load group info and messages
  useEffect(() => {
    const loadChatData = async () => {
      if (!groupId) {
        // No group ID provided, try to get user's groups and redirect to first one
        try {
          const response = await groupService.getGroups();
          if (response.success && response.data.length > 0) {
            // Redirect to the first group's chat
            const firstGroup = response.data[0];
            window.location.href = `/group-chat?group=${firstGroup._id}`;
            return;
          }
        } catch (error) {
          console.error('Error fetching groups:', error);
        }
        
        // If no groups found or error, show demo data
        setGroupInfo({
          _id: 'demo',
          name: 'Demo Support Group',
          description: 'Sample group for demonstration',
          members: [
            { name: 'Mais Masri' },
            { name: 'Sarah Johnson' },
            { name: 'Mike Chen' },
            { name: 'Emma Williams' }
          ]
        });
        
        setMessages([
          {
            _id: 'demo-1',
            content: 'Welcome to our group chat! How is everyone feeling today?',
            user: { name: 'Mais Masri' },
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            _id: 'demo-2',
            content: 'I\'m doing well, thanks for asking! 😊',
            user: { name: 'Sarah Johnson' },
            createdAt: new Date(Date.now() - 3000000).toISOString()
          },
          {
            _id: 'demo-3',
            content: 'Feeling motivated today! Ready to tackle the day.',
            user: { name: 'Mike Chen' },
            createdAt: new Date(Date.now() - 2400000).toISOString()
          },
          {
            _id: 'demo-4',
            content: 'Could use some support today. Feeling a bit overwhelmed.',
            user: { name: 'Emma Williams' },
            createdAt: new Date(Date.now() - 1800000).toISOString()
          },
          {
            _id: 'demo-5',
            content: 'Emma, I\'m here for you! Want to talk about what\'s on your mind?',
            user: { name: 'Mais Masri' },
            createdAt: new Date(Date.now() - 1200000).toISOString()
          }
        ]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Load group info
        const groupResponse = await groupService.getGroup(groupId);
        if (groupResponse.success) {
          setGroupInfo(groupResponse.data);
        }

        // Load messages
        const messagesResponse = await chatService.getGroupMessages(groupId);
        if (messagesResponse.success) {
          setMessages(messagesResponse.data);
        } else {
          throw new Error(messagesResponse.message || 'Failed to load messages');
        }

      } catch (error) {
        console.error('Error loading chat data:', error);
        setError('Failed to load chat. Please try again.');
        
        // Fallback to demo data if backend is unavailable
        setGroupInfo({
          _id: groupId,
          name: 'My Personal Group',
          description: 'Personal mood tracking group',
          members: [
            { name: 'Mais Masri' },
            { name: 'Sarah Johnson' },
            { name: 'Mike Chen' },
            { name: 'Emma Williams' }
          ]
        });
        
        setMessages([
          {
            _id: 'demo-1',
            content: 'Welcome to our group chat! How is everyone feeling today?',
            user: { name: 'Mais Masri' },
            createdAt: new Date(Date.now() - 3600000).toISOString()
          },
          {
            _id: 'demo-2',
            content: 'I\'m doing well, thanks for asking! 😊',
            user: { name: 'Sarah Johnson' },
            createdAt: new Date(Date.now() - 3000000).toISOString()
          },
          {
            _id: 'demo-3',
            content: 'Feeling motivated today! Ready to tackle the day.',
            user: { name: 'Mike Chen' },
            createdAt: new Date(Date.now() - 2400000).toISOString()
          },
          {
            _id: 'demo-4',
            content: 'Could use some support today. Feeling a bit overwhelmed.',
            user: { name: 'Emma Williams' },
            createdAt: new Date(Date.now() - 1800000).toISOString()
          },
          {
            _id: 'demo-5',
            content: 'Emma, I\'m here for you! Want to talk about what\'s on your mind?',
            user: { name: 'Mais Masri' },
            createdAt: new Date(Date.now() - 1200000).toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadChatData();
  }, [groupId]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      
      const response = await chatService.sendMessage(groupId, newMessage.trim());
      
      if (response.success) {
        // Add new message to the list
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      } else {
        throw new Error(response.message || 'Failed to send message');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Format time for display
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <LoadingSpinner text="Loading group chat..." />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex flex-col bg-gray-50">
          
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {groupInfo ? groupInfo.name : 'Group'} Chat
                </h2>
                <p className="text-sm text-gray-600">
                  {groupInfo ? `${groupInfo.members?.length || 0} members` : 'Loading...'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Real-time support</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="px-6 py-3">
              <Alert 
                type="error" 
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}

          {/* Demo Data Warning */}
          {groupId && messages.length > 0 && messages[0]._id === 'demo-1' && (
            <div className="px-6 py-3">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">⚠️</span>
                  <span>Backend unavailable - showing demo chat. Check your connection and try again.</span>
                </div>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.user.name === user?.firstName + ' ' + user?.lastName ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.user.name === user?.firstName + ' ' + user?.lastName
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {message.user.name === user?.firstName + ' ' + user?.lastName ? 'You' : message.user.name}
                      </span>
                      <span className={`text-xs ${
                        message.user.name === user?.firstName + ' ' + user?.lastName ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>

        </main>
      </div>
    </div>
  );
};

export default GroupChatPage;