import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleEditProfile = () => {
    // TODO: Add edit profile functionality
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-gray-500">Loading profile...</div>
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
            <div className="text-gray-500">No user data found</div>
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
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
              onClick={handleEditProfile}
            >
              <i className="fas fa-edit mr-1"></i> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {user.name || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {user.email || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">User ID</label>
                  <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800 font-mono text-sm">
                    {user._id || 'Not available'}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Profile Picture</h3>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Profile picture upload coming soon
                </p>
              </div>
            </div>
          </div>

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
                  Recently joined
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