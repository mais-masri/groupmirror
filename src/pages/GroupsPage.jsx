/**
 * GroupsPage - Create and manage mood tracking groups
 * Users can create groups, invite members, search groups, and view group statistics
 */
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import groupService from '../services/groupService';
import profileService from '../services/profileService';

const GroupsPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load user profile and groups in parallel
      const [profileData, groupsData] = await Promise.all([
        profileService.getProfile(),
        groupService.getGroups()
      ]);
      
      setUserProfile(profileData.data);
      setUserGroups(groupsData.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      
      const result = await groupService.createGroup({
        name: groupName.trim(),
        description: groupDescription.trim()
      });
      
      setSuccess('Group created successfully!');
      setGroupName('');
      setGroupDescription('');
      setShowCreateForm(false);
      
      // Reload groups
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;

    try {
      setSubmitting(true);
      setError('');
      
      const result = await groupService.joinGroup(joinCode.trim());
      
      setSuccess('Successfully joined group!');
      setJoinCode('');
      setShowJoinForm(false);
      
      // Reload groups
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group');
    } finally {
      setSubmitting(false);
    }
  };

  const copyInviteCode = (code) => {
    navigator.clipboard.writeText(code);
    setSuccess('Invite code copied to clipboard!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter groups based on search term
  const filteredGroups = userGroups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Choose Your Group</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome{userProfile?.firstName ? `, ${userProfile.firstName}` : ''}!
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm ? `${filteredGroups.length} of ${userGroups.length}` : userGroups.length} group{userGroups.length !== 1 ? 's' : ''}
                  {searchTerm && ` matching "${searchTerm}"`}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
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

          {success && (
            <Alert 
              type="success" 
              message={success} 
              onClose={() => setSuccess('')} 
            />
          )}

          {/* Create Group Form */}
          {showCreateForm && (
            <div className="mb-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-600">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Create New Group</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleCreateGroup}>
                <div className="mb-4">
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Group Name
                  </label>
                  <input
                    id="groupName"
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="groupDescription"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    placeholder="Enter group description"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
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
                    className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Join Group Form */}
          {showJoinForm && (
            <div className="mb-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-600">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Join Existing Group</h3>
                <button
                  onClick={() => setShowJoinForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              <form onSubmit={handleJoinGroup}>
                <div className="mb-6">
                  <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Group Code
                  </label>
                  <input
                    id="joinCode"
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter group invitation code"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Ask the group creator for the invitation code
                  </p>
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
                    className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Groups List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner text="Loading your groups..." />
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-users text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {searchTerm ? 'No groups found' : "You're not in a group yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm ? `No groups match "${searchTerm}"` : 'Join or create a group to start your mental health journey with others!'}
              </p>
              {!searchTerm && (
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
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredGroups.map((group) => (
                <div key={group._id} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">{group.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">{group.description}</p>
                    </div>
                    <div className="flex-shrink-0 ml-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {group.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Group Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-3 mr-4">
                          <i className="fas fa-users text-blue-600 dark:text-blue-400"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{group.members?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="bg-green-100 dark:bg-green-800 rounded-full p-3 mr-4">
                          <i className="fas fa-smile text-green-600 dark:text-green-400"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Mood Entries</p>
                          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{group.moodEntries || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="bg-purple-100 dark:bg-purple-800 rounded-full p-3 mr-4">
                          <i className="fas fa-clock text-purple-600 dark:text-purple-400"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            {formatDate(group.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Group Members */}
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Group Members</h4>
                    <div className="flex flex-wrap gap-3">
                      {group.members?.map((member, index) => (
                        <div key={index} className="flex items-center bg-gray-50 dark:bg-gray-600 rounded-lg px-4 py-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                            {member.firstName?.charAt(0) || member.username?.charAt(0) || 'U'}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {member.firstName ? `${member.firstName} ${member.lastName || ''}`.trim() : member.username}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => window.location.href = `/group-mood?group=${group._id}`}
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
                  </div>
                  
                  {/* Invite Code */}
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Invite Code</h5>
                    <div className="flex items-center">
                      <code className="bg-white dark:bg-gray-700 px-3 py-2 rounded border text-sm font-mono text-gray-800 dark:text-gray-200 mr-3">
                        {group.inviteCode}
                      </code>
                      <button 
                        onClick={() => copyInviteCode(group.inviteCode)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Copy Code
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Share this code with others to invite them to your group</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GroupsPage;
