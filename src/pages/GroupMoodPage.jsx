import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const GroupMoodPage = () => {
  const [timeRange, setTimeRange] = useState('This Week');

  const teamMembers = [
    { name: 'Sarah Johnson', mood: 'Excited', lastUpdated: '2 hours ago', comments: 'Looking forward!' },
    { name: 'Mike Chen', mood: 'Stressed', lastUpdated: '5 hours ago', comments: 'Deadline stress' },
    { name: 'Alex Rodriguez', mood: 'Happy', lastUpdated: '1 day ago', comments: 'Great progress' }
  ];

  const handleExport = () => {
    // TODO: Add export functionality
    console.log('Exporting group mood data...');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header sidebarToggleId="sidebar-toggle-2" sidebarId="sidebar-2" />
      <div className="flex flex-1">
        <Sidebar sidebarId="sidebar-2" />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Group Mood</h2>
            <div className="flex space-x-2">
              <select 
                className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
                <option>Last Month</option>
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
            <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Group mood chart will appear here</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Mood Distribution</h3>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Pie chart here</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Mood Over Time</h3>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                <p className="text-gray-500">Line chart here</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Team Members</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mood</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.mood}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.lastUpdated}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GroupMoodPage; 