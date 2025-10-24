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
import groupService from '../services/groupService';

const DashboardPage = () => {
  const [todaysMood, setTodaysMood] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [moodHistory, setMoodHistory] = useState([]);
  const [groupMoodData, setGroupMoodData] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user profile, mood data, and group data in parallel
      const [profileData, moodData, groupsData] = await Promise.all([
        profileService.getProfile(),
        getMoods(),
        groupService.getGroups()
      ]);
      
      setUserProfile(profileData.data);
      setMoodHistory(moodData);
      
      // Get today's mood entry
      const today = new Date().toDateString();
      const todaysEntry = moodData.find(mood => 
        new Date(mood.date).toDateString() === today
      );
      setTodaysMood(todaysEntry || null);
      
      // Load group mood data if user has groups
      if (groupsData.success && groupsData.data.length > 0) {
        try {
          const groupMoodResponse = await groupService.getGroupMoods(groupsData.data[0]._id);
          if (groupMoodResponse.success) {
            setGroupMoodData(groupMoodResponse.data);
          }
        } catch (error) {
          console.error('Error loading group mood data:', error);
        }
      }
      
      // Generate motivational message
      generateMotivationalMessage(todaysEntry, moodData, groupsData);
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      // Set empty state for new users
      setTodaysMood(null);
      setMoodHistory([]);
      setUserProfile(null);
      setGroupMoodData(null);
      generateMotivationalMessage(null, [], { success: true, data: [] });
    } finally {
      setLoading(false);
    }
  };

  // Generate AI-powered motivational message
  const generateMotivationalMessage = (todaysMood, moodHistory, groupsData) => {
    const messages = [];
    
    // Personal mood-based messages
    if (todaysMood) {
      switch (todaysMood.moodLevel) {
        case 5:
          messages.push("You're radiating positivity today! Keep shining! ✨");
          messages.push("Your happiness is contagious - spread that joy! 🌟");
          messages.push("What a beautiful day to be alive! You're amazing! 🌈");
          messages.push("Your positive energy is lighting up the world! Keep glowing! 💫");
          break;
        case 4:
          messages.push("You're in a great flow today! Keep that momentum going! 🚀");
          messages.push("Your motivation is inspiring others around you! 💪");
          messages.push("You're crushing it today! This energy is incredible! 🔥");
          messages.push("Look at you go! Your determination is unstoppable! ⚡");
          break;
        case 3:
          messages.push("Balance is beautiful - you're exactly where you need to be! ⚖️");
          messages.push("Steady progress is still progress! You're doing great! 📈");
          messages.push("Sometimes calm is exactly what you need. You're perfect! 🌸");
          messages.push("You're in a good place today. Trust the process! 🌱");
          break;
        case 2:
          messages.push("It's okay to have tough days. You're stronger than you know! 💙");
          messages.push("Remember: this feeling is temporary. You've got this! 🌈");
          messages.push("Every cloud has a silver lining. Better days are coming! ☁️");
          messages.push("You're allowed to feel down sometimes. Tomorrow is a new day! 🌅");
          break;
        case 1:
          messages.push("Take a deep breath. You're not alone in this! 🤗");
          messages.push("Even the strongest people need support sometimes. Reach out! 💪");
          messages.push("This too shall pass. You're braver than you believe! 🦋");
          messages.push("It's okay to not be okay. You're doing your best! 💜");
          break;
      }
    }
    
    // Mood trend-based messages
    if (moodHistory && moodHistory.length >= 3) {
      const recentMoods = moodHistory.slice(-3).map(m => m.moodLevel);
      const avgRecent = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
      
      if (avgRecent >= 4) {
        messages.push("Your consistent positive energy is amazing! Keep it up! 🌟");
        messages.push("You've been on fire lately! This streak is incredible! 🔥");
        messages.push("Your positive momentum is unstoppable! Ride this wave! 🌊");
        messages.push("Look at this amazing consistency! You're inspiring! ✨");
      } else if (avgRecent <= 2) {
        messages.push("You've been through a lot lately. Remember to be kind to yourself! 💙");
        messages.push("Tough times don't last, but tough people do. You've got this! 💪");
        messages.push("It's okay to have rough patches. You're stronger than you know! 🌈");
        messages.push("Every storm runs out of rain. Brighter days are ahead! ☀️");
      }
    }
    
    // Group-based messages
    if (groupsData && groupsData.success && groupsData.data.length > 0) {
      messages.push("Your team is lucky to have someone as caring as you! 🤝");
      messages.push("Together, you and your team can overcome anything! 💪");
      messages.push("Your leadership in the group is making a real difference! 👑");
      messages.push("The support you give your team is priceless! Keep being awesome! 🌟");
    }
    
    // Time-based messages
    const hour = new Date().getHours();
    if (hour < 12) {
      messages.push("Good morning! Today is full of possibilities! 🌅");
      messages.push("Rise and shine! This day is yours to conquer! ☀️");
      messages.push("Morning vibes! Let's make today amazing! 🌸");
      messages.push("Fresh start, fresh energy! You've got this! 🌱");
    } else if (hour < 17) {
      messages.push("Hope you're having a wonderful day! ☀️");
      messages.push("Midday check-in: You're doing great! Keep going! 💪");
      messages.push("Your afternoon energy is fantastic! Stay strong! ⚡");
      messages.push("Look at you powering through the day! Amazing! 🚀");
    } else {
      messages.push("You've made it through another day - that's something to celebrate! 🌙");
      messages.push("Evening reflection: You did your best today! Well done! 🌟");
      messages.push("Another day conquered! You should be proud! 🏆");
      messages.push("Time to rest and recharge. You've earned it! 💤");
    }
    
    // Select a random message
    const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
    setMotivationalMessage(selectedMessage);
  };

  // Calculate mood trend for mini chart
  const getMoodTrend = () => {
    if (!moodHistory || moodHistory.length < 2) return [];
    
    const last7Days = moodHistory.slice(-7);
    return last7Days.map(mood => ({
      date: new Date(mood.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: mood.moodLevel
    }));
  };

  // Calculate group mood summary
  const getGroupMoodSummary = () => {
    if (!groupMoodData || groupMoodData.length === 0) return null;
    
    const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    groupMoodData.forEach(mood => {
      moodCounts[mood.value] = (moodCounts[mood.value] || 0) + 1;
    });
    
    const totalMoods = groupMoodData.length;
    const avgMood = groupMoodData.reduce((sum, mood) => sum + mood.value, 0) / totalMoods;
    
    return {
      average: avgMood.toFixed(1),
      total: totalMoods,
      distribution: moodCounts
    };
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
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome back{userProfile?.firstName ? `, ${userProfile.firstName}` : ''}!
              </h2>
              {motivationalMessage && (
                <p className={`text-lg font-semibold mt-2 ${
                  todaysMood?.moodLevel >= 4 ? 'text-green-600' : 
                  todaysMood?.moodLevel <= 2 ? 'text-blue-600' : 
                  'text-purple-600'
                }`}>
                  {motivationalMessage}
                </p>
              )}
            </div>
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

          {/* New Dashboard Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Personal Mood Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Mood Trend</h3>
              {getMoodTrend().length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last 7 days</span>
                    <span className="text-sm font-medium text-gray-800">
                      Avg: {(getMoodTrend().reduce((sum, day) => sum + day.value, 0) / getMoodTrend().length).toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex items-end space-x-2 h-20">
                    {getMoodTrend().map((day, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full rounded-t ${
                            day.value >= 4 ? 'bg-green-400' : 
                            day.value >= 3 ? 'bg-yellow-400' : 
                            'bg-red-400'
                          }`}
                          style={{ height: `${(day.value / 5) * 60}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1">{day.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Start logging moods to see your trend!</p>
                </div>
              )}
            </div>

            {/* Group Pulse */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Group Pulse</h3>
              {getGroupMoodSummary() ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Today's average</span>
                    <span className="text-lg font-bold text-gray-800">
                      {getGroupMoodSummary().average}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total entries</span>
                    <span className="text-sm font-medium text-gray-800">
                      {getGroupMoodSummary().total} members
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(level => {
                      const count = getGroupMoodSummary().distribution[level] || 0;
                      const percentage = getGroupMoodSummary().total > 0 ? (count / getGroupMoodSummary().total) * 100 : 0;
                      return (
                        <div key={level} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div 
                              className={`h-2 rounded-full ${
                                level >= 4 ? 'bg-green-400' : 
                                level >= 3 ? 'bg-yellow-400' : 
                                'bg-red-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{level}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Join a group to see group mood data!</p>
                </div>
              )}
            </div>

          </div>

          {/* Mood Alerts */}
          <div className="mb-8">
            <MoodAlerts 
              groupId="current-group" 
              showAllGroups={true}
              onSupportRequest={(alert) => {
                console.log('Support request:', alert);
                // TODO: Handle support request - maybe navigate to group chat
              }} 
            />
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;