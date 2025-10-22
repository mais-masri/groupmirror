/**
 * DashboardPage - Main home page showing today's mood and personalized welcome
 * Displays user's current mood status and provides quick access to mood updates
 */
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MoodAlerts from '../components/MoodAlerts';
import { getMoods } from '../services/moodService';
import profileService from '../services/profileService';

const DashboardPage = () => {
  const [todaysMood, setTodaysMood] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load both user profile and today's mood in parallel
      const [profileData, moodData] = await Promise.all([
        profileService.getProfile(),
        getMoods()
      ]);
      
      setUserProfile(profileData.data);
      
      // Get today's mood entry
      const today = new Date().toDateString();
      const todaysEntry = moodData.find(mood => 
        new Date(mood.date).toDateString() === today
      );
      setTodaysMood(todaysEntry || null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      // For demo purposes, set a sample mood
      setTodaysMood({
        moodLevel: 4,
        description: 'Feeling motivated today!',
        date: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const getMoodInfo = (moodValue) => {
    const moods = {
      1: { emoji: '🔥', label: 'Stressed', color: 'bg-red-500', textColor: 'text-red-700' },
      2: { emoji: '🌧️', label: 'Sad', color: 'bg-blue-500', textColor: 'text-blue-700' },
      3: { emoji: '⚪', label: 'Neutral', color: 'bg-gray-400', textColor: 'text-gray-700' },
      4: { emoji: '🌱', label: 'Motivated', color: 'bg-green-500', textColor: 'text-green-700' },
      5: { emoji: '☀️', label: 'Happy', color: 'bg-yellow-400', textColor: 'text-yellow-700' }
    };
    return moods[moodValue] || moods[3];
  };

  const moodInfo = todaysMood ? getMoodInfo(todaysMood.moodLevel) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome back{userProfile?.firstName ? `, ${userProfile.firstName}` : ''}!
            </h2>
          </div>

          {/* Today's Mood Section */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Mood</h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600">Loading your mood...</span>
                </div>
              ) : todaysMood ? (
                <div className="flex items-center">
                  <div className={`w-16 h-16 ${moodInfo.color} rounded-full flex items-center justify-center text-white text-2xl mr-4 relative`}>
                    {moodInfo.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-xl font-bold text-gray-800">{moodInfo.label}</h4>
                      <span className="text-sm text-gray-500 font-medium">
                        {new Date(todaysMood.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <p className="text-gray-600">Mood Level: {todaysMood.moodLevel}/5</p>
                    {todaysMood.description && (
                      <p className="text-gray-700 mt-1 italic">"{todaysMood.description}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => window.location.href = '/enter-mood'}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Update Mood
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-2xl mx-auto mb-4">
                    🤔
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">No mood logged today</h4>
                  <p className="text-gray-600 mb-4">How are you feeling right now?</p>
                  <button
                    onClick={() => window.location.href = '/enter-mood'}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  >
                    <i className="fas fa-plus mr-2"></i>
                    Log Your Mood
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mood Alerts */}
          <div className="mb-8">
            <MoodAlerts groupId="current-group" onSupportRequest={(alert) => {
              console.log('Support request:', alert);
              // TODO: Handle support request - maybe navigate to group chat
            }} />
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;