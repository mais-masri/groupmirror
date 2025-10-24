/**
 * SettingsPage - Application preferences and user account settings
 * Configure notifications, appearance, privacy settings, and theme preferences
 */
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import settingsService from '../services/settingsService';
import { useTheme } from '../contexts/ThemeContext';

const SettingsPage = () => {
  const { theme, changeTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    // Notification Settings
    pushNotifications: true,
    emailReminders: true,
    moodReminderTime: '20:00',
    weeklyReports: true,
    groupNotifications: true,
    
    // Privacy Settings
    profileVisibility: 'private',
    moodSharing: false,
    dataExport: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getSettings();
      if (response.success && response.data) {
        setSettings(prev => ({
          ...prev,
          ...response.data
        }));
        // Always sync theme from backend to context
        if (response.data.theme) {
          changeTheme(response.data.theme);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Continue with default settings if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleThemeChange = async (newTheme) => {
    console.log('Changing theme to:', newTheme);
    changeTheme(newTheme);
    handleSettingChange('theme', newTheme);
    
    // Save theme immediately to backend
    try {
      await settingsService.updateSettings({
        ...settings,
        theme: newTheme
      });
      console.log('Theme saved to backend:', newTheme);
    } catch (error) {
      console.error('Error saving theme to backend:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await settingsService.updateSettings({
        ...settings,
        theme: theme
      });
      setSuccess('Settings saved successfully!');
    } catch (error) {
      setError('Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      try {
        setSaving(true);
        setError('');
        setSuccess('');
        
        const response = await settingsService.resetSettings();
        if (response.success) {
          setSettings(prev => ({
            ...prev,
            ...response.data
          }));
          changeTheme('auto');
          setSuccess('Settings reset to defaults successfully!');
        }
      } catch (error) {
        setError('Failed to reset settings. Please try again.');
        console.error('Error resetting settings:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
            <LoadingSpinner text="Loading settings..." />
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
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h2>
            <button
              onClick={handleResetSettings}
              disabled={saving}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50"
            >
              Reset to Defaults
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="space-y-6">
            {/* Theme Settings */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">🎨 Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => handleThemeChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">🔔 Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Push Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications about mood reminders</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Email Reminders</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive email reminders for mood tracking</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailReminders}
                      onChange={(e) => handleSettingChange('emailReminders', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Weekly Reports</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly mood summary reports</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.weeklyReports}
                      onChange={(e) => handleSettingChange('weeklyReports', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Group Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications from group activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.groupNotifications}
                      onChange={(e) => handleSettingChange('groupNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mood Reminder Time
                  </label>
                  <input
                    type="time"
                    value={settings.moodReminderTime}
                    onChange={(e) => handleSettingChange('moodReminderTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">🔒 Privacy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Visibility
                  </label>
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                  >
                    <option value="private">Private</option>
                    <option value="friends">Friends Only</option>
                    <option value="public">Public</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Mood Sharing</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow sharing mood data with friends</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.moodSharing}
                      onChange={(e) => handleSettingChange('moodSharing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Data Export</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow exporting your mood data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.dataExport}
                      onChange={(e) => handleSettingChange('dataExport', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;