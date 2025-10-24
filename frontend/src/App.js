import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Import pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import GroupSelectPage from './pages/GroupSelectPage';
import MoodEntryPage from './pages/MoodEntryPage';
import HistorySupportPage from './pages/HistorySupportPage';
import DashboardPage from './pages/DashboardPage';
import GroupMoodPage from './pages/GroupMoodPage';
import GroupChatPage from './pages/GroupChatPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import GroupsPage from './pages/GroupsPage';
import DebugPage from './pages/DebugPage';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [apiDown, setApiDown] = useState(false);

  useEffect(() => {
    const handleApiDown = () => setApiDown(true);
    const handleApiUp = () => setApiDown(false);

    window.addEventListener('api:down', handleApiDown);
    window.addEventListener('api:up', handleApiUp);

    return () => {
      window.removeEventListener('api:down', handleApiDown);
      window.removeEventListener('api:up', handleApiUp);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div id="app" className="min-h-screen flex flex-col">
              {apiDown && (
                <div className="bg-red-500 text-white text-center py-2 px-4 text-sm">
                  API is unreachable. Retrying...
                </div>
              )}
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected routes */}
              <Route path="/select-group" element={
                <ProtectedRoute>
                  <GroupSelectPage />
                </ProtectedRoute>
              } />
              <Route path="/enter-mood" element={
                <ProtectedRoute>
                  <MoodEntryPage />
                </ProtectedRoute>
              } />
              <Route path="/history-support" element={
                <ProtectedRoute>
                  <HistorySupportPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/group-mood" element={
                <ProtectedRoute>
                  <GroupMoodPage />
                </ProtectedRoute>
              } />
              <Route path="/group-chat" element={
                <ProtectedRoute>
                  <GroupChatPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="/groups" element={
                <ProtectedRoute>
                  <GroupsPage />
                </ProtectedRoute>
              } />
              
              {/* Debug route */}
              <Route path="/debug" element={<DebugPage />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 