/**
 * ProfilePage - User profile management and account settings
 * View and edit personal information, mood statistics, and account details
 */
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import profileService from '../services/profileService';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileResponse, statsResponse] = await Promise.all([
        profileService.getProfile(),
        profileService.getProfileStats()
      ]);
      
      if (profileResponse.success) {
        setUser(profileResponse.data);
        setEditForm({
          firstName: profileResponse.data.firstName || '',
          lastName: profileResponse.data.lastName || '',
          username: profileResponse.data.username || '',
          email: profileResponse.data.email || ''
        });
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    if (editing) {
      // Reset form when canceling
      setEditForm({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        username: user?.username || '',
        email: user?.email || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      const response = await profileService.updateProfile(editForm);
      
      if (response.success) {
        setUser(response.data);
        setEditing(false);
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getMoodEmoji = (moodType) => {
    const moodEmojis = {
      'Happy': '☀️',
      'Motivated': '🌱',
      'Neutral': '⚪',
      'Sad': '🌧️',
      'Stressed': '🔥'
    };
    return moodEmojis[moodType] || '❓';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <div className="text-gray-500">Loading profile...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <div className="text-gray-500">{error || 'No user data found'}</div>
            </div>
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
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                editing 
                  ? 'bg-gray-500 hover:bg-gray-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
              onClick={handleEditToggle}
              disabled={saving}
            >
              <i className={`fas ${editing ? 'fa-times' : 'fa-edit'} mr-1`}></i>
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
                    {editing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={editForm.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter first name"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                        {user.firstName || 'Not provided'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
                    {editing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={editForm.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter last name"
                      />
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                        {user.lastName || 'Not provided'}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Username</label>
                  {editing ? (
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter username"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                      @{user.username || 'Not provided'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                      {user.email || 'Not provided'}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">User ID</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-mono text-sm">
                    {user._id || 'Not available'}
                  </div>
                </div>
              </div>
              
              {editing && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>

            {/* Mood Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Mood Statistics</h3>
              {stats ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats.totalMoods}</div>
                    <div className="text-sm text-gray-600">Total Mood Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.daysSinceRegistration}</div>
                    <div className="text-sm text-gray-600">Days as Member</div>
                  </div>
                  {stats.recentMoods && stats.recentMoods.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Recent Moods</h4>
                      <div className="space-y-2">
                        {stats.recentMoods.slice(0, 3).map((mood, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <span className="text-lg">{getMoodEmoji(mood.moodType)}</span>
                              <span className="text-gray-600">{mood.moodType}</span>
                            </span>
                            <span className="text-gray-500">{formatDate(mood.date)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-sm">No mood data yet</div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Account Status</label>
                <div className="px-4 py-2 bg-green-50 text-green-800 rounded-lg">
                  Active
                </div>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">Member Since</label>
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                  {stats?.memberSince ? formatDate(stats.memberSince) : 'Recently joined'}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage; 