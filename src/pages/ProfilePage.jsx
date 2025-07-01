import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    position: 'Team Lead',
    bio: 'I lead the product team and believe in open communication about our feelings at work.'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSave = () => {
    // TODO: Add save functionality
    console.log('Saving profile changes:', formData);
  };

  const handleUploadPhoto = () => {
    // TODO: Add photo upload functionality
    console.log('Uploading new photo...');
  };

  const handleRemovePhoto = () => {
    // TODO: Add photo removal functionality
    console.log('Removing photo...');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header sidebarToggleId="sidebar-toggle-4" sidebarId="sidebar-4" />
      <div className="flex flex-1">
        <Sidebar sidebarId="sidebar-4" />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
              onClick={handleSave}
            >
              <i className="fas fa-save mr-1"></i> Save Changes
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Personal Information</h3>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-gray-700 text-sm font-medium mb-1">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-1">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="position" className="block text-gray-700 text-sm font-medium mb-1">Position</label>
                  <input
                    id="position"
                    type="text"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-gray-700 text-sm font-medium mb-1">Bio</label>
                  <textarea
                    id="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Profile Picture</h3>
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold mb-4">JD</div>
                <button 
                  className="text-sm text-primary font-medium mb-2"
                  onClick={handleUploadPhoto}
                >
                  Upload New Photo
                </button>
                <button 
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={handleRemovePhoto}
                >
                  Remove Photo
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Your Mood History</h3>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Personal mood chart</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage; 