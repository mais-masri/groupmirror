import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const TrendsPage = () => {
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  const insights = [
    { text: 'Happiness peaks on Fridays by 35%.', highlight: 'Happiness peaks' },
    { text: 'Stress is highest mid-week.', highlight: 'Stress' },
    { text: 'Excitement spikes with announcements.', highlight: 'Excitement' }
  ];

  const handleExport = () => {
    // TODO: Add export functionality
    console.log('Exporting trends data...');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header sidebarToggleId="sidebar-toggle-3" sidebarId="sidebar-3" />
      <div className="flex flex-1">
        <Sidebar sidebarId="sidebar-3" />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Mood Trends</h2>
            <div className="flex space-x-2">
              <select 
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
              <button 
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
                onClick={handleExport}
              >
                <i className="fas fa-download mr-1"></i> Export
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Overview</h3>
            <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Overview chart</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Weekly Patterns</h3>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Chart</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Mood Correlations</h3>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Analysis</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Insights</h3>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">{insight.highlight}</span> {insight.text.replace(insight.highlight, '')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrendsPage; 