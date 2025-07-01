import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MoodCalendar from "../components/MoodCalendar";

const MoodEntryPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header sidebarToggleId="sidebar-toggle" sidebarId="sidebar" />
      <div className="flex flex-1">
        <Sidebar sidebarId="sidebar" />
        <main className="flex-1 p-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            How are you feeling?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button className="bg-yellow-400 text-white py-3 rounded-lg font-medium">
              Happy
            </button>
            <button className="bg-pink-400 text-white py-3 rounded-lg font-medium">
              Excited
            </button>
            <button className="bg-teal-400 text-white py-3 rounded-lg font-medium">
              Calm
            </button>
            <button className="bg-cyan-900 text-white py-3 rounded-lg font-medium">
              Sad
            </button>
            <button className="bg-blue-500 text-white py-3 rounded-lg font-medium">
              Stressed
            </button>
            <button className="bg-gray-600 text-white py-3 rounded-lg font-medium">
              Neutral
            </button>
          </div>
          {/* Calendar Component */}
          <MoodCalendar />
        </main>
      </div>
    </div>
  );
};

export default MoodEntryPage;