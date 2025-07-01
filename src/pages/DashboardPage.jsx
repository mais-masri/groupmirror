import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const DashboardPage = () => {
  const moodStats = [
    { name: 'Happy', color: 'bg-yellow-200', icon: 'fas fa-smile', count: 24, description: 'Positive vibes' },
    { name: 'Excited', color: 'bg-pink-200', icon: 'fas fa-grin-stars', count: 12, description: 'High energy' },
    { name: 'Calm', color: 'bg-green-200', icon: 'fas fa-spa', count: 18, description: 'Peaceful state' },
    { name: 'Stressed', color: 'bg-red-200', icon: 'fas fa-tired', count: 5, description: 'Needs support' }
  ];

  const recentActivity = [
    { name: 'Sarah', mood: 'excited', message: 'excited about the new project', time: '2 hours ago' },
    { name: 'Mike', mood: 'stressed', message: 'stressed about deadlines', time: '5 hours ago' },
    { name: 'Alex', mood: 'happy', message: 'happy about team progress', time: '1 day ago' }
  ];

  const moodColors = {
    happy: 'bg-yellow-400 text-yellow-800',
    excited: 'bg-pink-400 text-pink-800',
    calm: 'bg-green-400 text-green-800',
    stressed: 'bg-red-400 text-red-800',
    neutral: 'bg-gray-400 text-gray-800',
    sad: 'bg-blue-400 text-blue-800',
  };

  const handleExport = () => {
    console.log('Exporting dashboard data...');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back, John!</h2>

          {/* Mood Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {moodStats.map((stat) => (
              <div key={stat.name} className={`${stat.color} rounded-xl p-6 shadow-sm cursor-pointer`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{stat.name}</h3>
                    <p className="text-gray-700 text-sm">{stat.description}</p>
                  </div>
                  <div className="bg-white bg-opacity-30 rounded-full p-2">
                    <i className={`${stat.icon} text-xl`}></i>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold">{stat.count}</p>
                  <p className="text-sm">team members</p>
                </div>
              </div>
            ))}
          </div>

          {/* Team Mood Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-800">Team Mood Summary</h3>
              <button
                onClick={handleExport}
                className="text-sm text-primary font-medium hover:underline"
              >
                Export
              </button>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <p className="text-gray-500">Mood chart will appear here</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      moodColors[activity.mood]
                    } flex items-center justify-center mr-3 mt-1`}
                  >
                    <i className="fas fa-user text-sm"></i>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.name}</span> shared that they are feeling
                      <span className="font-medium"> {activity.mood}</span> about {activity.message}.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;