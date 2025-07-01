import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const SettingsPage = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    daily: false
  });

  const themes = [
    { name: 'Default', colors: ['bg-primary', 'bg-excited', 'bg-happy'], selected: true },
    { name: 'Cool', colors: ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500'], selected: false },
    { name: 'Earth', colors: ['bg-green-500', 'bg-teal-500', 'bg-emerald-500'], selected: false },
    { name: 'Warm', colors: ['bg-pink-500', 'bg-rose-500', 'bg-red-500'], selected: false }
  ];

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.id]: e.target.value
    });
  };

  const handleNotificationChange = (type) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type]
    });
  };

  const handleUpdatePassword = () => {
    // TODO: Add password update logic
    console.log('Updating password:', passwordData);
  };

  const handleThemeSelect = (themeName) => {
    // TODO: Add theme selection logic
    console.log('Selected theme:', themeName);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header sidebarToggleId="sidebar-toggle-5" sidebarId="sidebar-5" />
      <div className="flex flex-1">
        <Sidebar sidebarId="sidebar-5" />
        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Account Settings</h3>
              <form>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-gray-700 text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-gray-700 text-sm font-medium mb-1">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="button"
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                  onClick={handleUpdatePassword}
                >
                  Update Password
                </button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-30 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Push Notifications</p>
                    <p className="text-sm text-gray-500">Receive app notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.push}
                      onChange={() => handleNotificationChange('push')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-30 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Daily Reminders</p>
                    <p className="text-sm text-gray-500">Remind me to check in</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={notifications.daily}
                      onChange={() => handleNotificationChange('daily')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-30 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Theme Preferences</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <button 
                    key={theme.name}
                    className={`p-4 rounded-lg border-2 ${theme.selected ? 'border-primary' : 'border hover:border-gray-300'}`}
                    onClick={() => handleThemeSelect(theme.name)}
                  >
                    <div className="flex items-center">
                      {theme.colors.map((color, index) => (
                        <div key={index} className={`w-6 h-6 rounded-full ${color} ${index < theme.colors.length - 1 ? 'mr-2' : ''}`}></div>
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-medium">{theme.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage; 