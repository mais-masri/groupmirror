import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import RecommendationsPanel from '../components/RecommendationsPanel';
import recommendationService from '../utils/recommendationService';

const RecommendationsPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [filterType, setFilterType] = useState('all');
  const [showInsights, setShowInsights] = useState(true);

  // Mock user data for demonstration
  const mockUserData = {
    moodHistory: [
      { mood: '😊', date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000) },
      { mood: '😐', date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
      { mood: '😔', date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) },
      { mood: '😐', date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { mood: '🙁', date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000) },
      { mood: '😐', date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
      { mood: '🙂', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      { mood: '😊', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      { mood: '😐', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { mood: '😔', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { mood: '😐', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { mood: '🙂', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { mood: '😊', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
      { mood: '😀', date: new Date() }
    ],
    groups: ['Engineering Team', 'Project Alpha', 'Wellness Group'],
    preferences: {
      notifications: true,
      privateMode: false,
      recommendationFrequency: 'daily'
    }
  };

  const handleExport = () => {
    const result = recommendationService.processUserDataForRecommendations(mockUserData);
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = `recommendations-${new Date().toISOString().slice(0, 10)}.json`;
    link.href = url;
    link.click();
  };

  const handleShare = () => {
    // In a real app, this would share via API
    alert('Sharing recommendations with your team...');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Personalized Recommendations</h2>
                <p className="text-gray-600 mt-1">
                  AI-powered suggestions based on your mood patterns and team dynamics
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleShare}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
                >
                  <i className="fas fa-share-alt mr-2"></i>
                  Share
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
                >
                  <i className="fas fa-download mr-2"></i>
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Time Range Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Time Range:</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Type:</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Recommendations</option>
                  <option value="activity">Activities</option>
                  <option value="social">Social</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="support">Support</option>
                  <option value="group">Group</option>
                </select>
              </div>

              {/* Toggle Insights */}
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInsights}
                    onChange={(e) => setShowInsights(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Insights</span>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Recommendations</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">12</p>
                </div>
                <div className="text-3xl">📋</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed This Week</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">8</p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">67%</p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Mood Improvement</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">+24%</p>
                </div>
                <div className="text-3xl">📈</div>
              </div>
            </div>
          </div>

          {/* Main Recommendations Panel */}
          <RecommendationsPanel userData={mockUserData} />

          {/* Additional Resources */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Additional Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">📚</span>
                  <h4 className="font-semibold text-gray-800">Wellness Library</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Articles and guides on mental health and wellbeing
                </p>
              </a>
              
              <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🎯</span>
                  <h4 className="font-semibold text-gray-800">Goal Setting</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Set and track personal wellness goals
                </p>
              </a>
              
              <a href="#" className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">👥</span>
                  <h4 className="font-semibold text-gray-800">Community Support</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Connect with others on similar journeys
                </p>
              </a>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">Help us improve recommendations</h3>
                <p className="text-sm text-gray-600">
                  Your feedback helps us provide better, more personalized suggestions
                </p>
              </div>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition font-medium">
                Provide Feedback
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecommendationsPage;