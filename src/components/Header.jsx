import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ sidebarToggleId = 'sidebar-toggle', sidebarId = 'sidebar' }) => {
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const sidebar = document.getElementById(sidebarId);
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            id={sidebarToggleId}
            className="md:hidden mr-4 text-gray-600 focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold"
              aria-label="GroupMirror logo"
            >
              GM
            </div>
            <h1 className="ml-2 text-xl font-bold text-gray-800">GroupMirror</h1>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Logout"
        >
          <i className="fas fa-sign-out-alt mr-1"></i>
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;