import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const GroupSelectPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Group</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <p className="mb-4">
                Welcome, <span className="font-semibold">John Doe</span>
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Enter Mood
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                  History & Support
                </button>
              </div>
              <input
                type="text"
                placeholder="Search group..."
                className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className="w-full px-4 py-2 border rounded-lg hover:bg-gray-100">Team A</button>
                <button className="w-full px-4 py-2 border rounded-lg hover:bg-gray-100">Team B</button>
                <button className="w-full px-4 py-2 border rounded-lg hover:bg-gray-100">Team C</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GroupSelectPage;