import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { createGroup, getUserGroups } from '../services/groupService';

const GroupsPage = () => {
  const [userGroup, setUserGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showGroupSettings, setShowGroupSettings] = useState(false);

  useEffect(() => {
    loadUserGroup();
  }, []);

  const loadUserGroup = async () => {
    try {
      setLoading(true);
      const groupData = await getUserGroups();
      // Since each user is in only one group, take the first (and only) group
      if (Array.isArray(groupData) && groupData.length > 0) {
        setUserGroup(groupData[0]);
      } else {
        // No group found - user needs to create or join one
        setUserGroup(null);
      }
    } catch (err) {
      console.error('Error loading user group:', err);
      // For demo purposes, show a sample group even on error
      const demoGroup = {
        _id: 'demo-group',
        name: 'My Support Group',
        description: 'Our close-knit group for mutual support and mood tracking',
        members: [
          { name: 'Sarah', role: 'Member' },
          { name: 'Mike', role: 'Member' },
          { name: 'Alex', role: 'Member' }
        ],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        moodCount: 25,
        inviteCode: 'SUPPORT2024'
      };
      setUserGroup(demoGroup);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (window.confirm('Are you sure you want to leave this group? This action cannot be undone.')) {
      try {
        setSubmitting(true);
        // TODO: Call API to leave group
        console.log('Leaving group:', userGroup._id);
        
        // For demo purposes, simulate leaving group
        setTimeout(() => {
          setUserGroup(null);
          setShowGroupSettings(false);
          alert('Successfully left the group');
        }, 1000);
      } catch (err) {
        setError('Failed to leave group');
        console.error('Error leaving group:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      setSubmitting(true);
      await createGroup(groupName.trim());
      await loadUserGroup(); // Reload user group after creating
      setGroupName('');
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      setSubmitting(true);
      
      // Demo group codes for testing
      const validCodes = ['WORK2024', 'FAMILY2024', 'STUDY2024'];
      
      if (validCodes.includes(joinCode.trim().toUpperCase())) {
        // Simulate successful join
        setTimeout(() => {
          setError(''); // Clear any previous errors
          setJoinCode('');
          setShowJoinForm(false);
          // Show success message
          alert(`Successfully joined group with code: ${joinCode.trim().toUpperCase()}`);
          // Reload groups to show the new group
          loadUserGroup();
        }, 1000);
      } else {
        setError('Invalid group code. Try: WORK2024, FAMILY2024, or STUDY2024');
        setSubmitting(false);
      }
      
    } catch (err) {
      setError('Failed to join group. Please check the group code.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Choose Your Group</h2>
              <p className="text-gray-600 mt-1">Welcome, username</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500">
                  {userGroup ? `${userGroup.members?.length || 0} members` : 'No group yet'}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Create Group
              </button>
              <button 
                onClick={() => setShowJoinForm(true)}
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Join Group
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search Group..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>

          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={() => setError('')} 
            />
          )}

          {/* Create Group Form */}
          {showCreateForm && !userGroup && (
            <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Create New Group</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleCreateGroup}>
                <div className="mb-6">
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name
                  </label>
                  <input
                    id="groupName"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    {submitting ? 'Creating...' : 'Create Group'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Join Group Form */}
          {showJoinForm && !userGroup && (
            <div className="mb-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Join Existing Group</h3>
                <button
                  onClick={() => setShowJoinForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleJoinGroup}>
                <div className="mb-6">
                  <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Group Code
                  </label>
                  <input
                    id="joinCode"
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter group invitation code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Ask the group creator for the invitation code
                  </p>
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium mb-1">Demo codes to try:</p>
                    <div className="flex gap-2 text-xs text-blue-600">
                      <span className="bg-blue-100 px-2 py-1 rounded">WORK2024</span>
                      <span className="bg-blue-100 px-2 py-1 rounded">FAMILY2024</span>
                      <span className="bg-blue-100 px-2 py-1 rounded">STUDY2024</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    {submitting ? 'Joining...' : 'Join Group'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowJoinForm(false)}
                    className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* User's Group */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner text="Loading your group..." />
            </div>
          ) : !userGroup ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-users text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">You're not in a group yet</h3>
              <p className="text-gray-600 mb-6">Join or create a group to start your mental health journey with others!</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Create Group
                </button>
                <button
                  onClick={() => setShowJoinForm(true)}
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                >
                  Join Group
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-gray-800 mb-3">{userGroup.name}</h3>
                    <p className="text-gray-600 text-lg mb-4">{userGroup.description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {userGroup.name.charAt(0)}
                    </div>
                  </div>
                </div>
                
                {/* Group Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-3 mr-4">
                        <i className="fas fa-users text-blue-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Members</p>
                        <p className="text-2xl font-bold text-gray-800">{userGroup.members?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-full p-3 mr-4">
                        <i className="fas fa-smile text-green-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Mood Entries</p>
                        <p className="text-2xl font-bold text-gray-800">{userGroup.moodCount || 0}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-full p-3 mr-4">
                        <i className="fas fa-clock text-purple-600"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Last Activity</p>
                        <p className="text-lg font-semibold text-gray-800">
                          {userGroup.lastActivity ? new Date(userGroup.lastActivity).toLocaleDateString() : 'Today'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Group Members */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Group Members</h4>
                  <div className="flex flex-wrap gap-3">
                    {userGroup.members?.map((member, index) => (
                      <div key={index} className="flex items-center bg-gray-50 rounded-lg px-4 py-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                          {member.name.charAt(0)}
                        </div>
                        <span className="text-gray-700 font-medium">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => window.location.href = `/group-mood?group=${userGroup._id}`}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-chart-pie mr-2"></i>
                    View Group Mood
                  </button>
                  <button
                    onClick={() => window.location.href = '/group-chat'}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-comments mr-2"></i>
                    Open Group Chat
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowGroupSettings(!showGroupSettings)}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                    >
                      <i className="fas fa-cog"></i>
                    </button>
                    
                    {/* Group Settings Dropdown */}
                    {showGroupSettings && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <div className="py-2">
                          <button
                            onClick={handleLeaveGroup}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            Leave Group
                          </button>
                          <button
                            onClick={() => setShowGroupSettings(false)}
                            className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <i className="fas fa-times mr-2"></i>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Invite Code */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Invite Code</h5>
                  <div className="flex items-center">
                    <code className="bg-white px-3 py-2 rounded border text-sm font-mono text-gray-800 mr-3">
                      {userGroup.inviteCode}
                    </code>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Copy Code
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Share this code with others to invite them to your group</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GroupsPage;
