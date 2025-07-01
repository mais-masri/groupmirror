import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GroupSelectPage from './pages/GroupSelectPage';
import MoodEntryPage from './pages/MoodEntryPage';
import HistorySupportPage from './pages/HistorySupportPage';
import DashboardPage from './pages/DashboardPage';
import GroupMoodPage from './pages/GroupMoodPage';
import TrendsPage from './pages/TrendsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <div id="app" className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/select-group" element={<GroupSelectPage />} />
          <Route path="/enter-mood" element={<MoodEntryPage />} />
          <Route path="/history-support" element={<HistorySupportPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/group-mood" element={<GroupMoodPage />} />
          <Route path="/trends" element={<TrendsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 