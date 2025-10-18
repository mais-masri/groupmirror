import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ sidebarId = 'sidebar' }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      id={sidebarId}
      className="sidebar bg-white w-64 shadow-md md:shadow-none md:translate-x-0 hidden md:block"
    >
      <div className="p-4">
        {/* App Logo */}
        <div className="flex items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            GM
          </div>
          <div className="ml-3">
            <p className="font-bold text-lg text-gray-800">GroupMirror</p>
            <p className="text-xs text-gray-500">Mood Tracking</p>
          </div>
        </div>
        {/* Navigation */}
        <nav>
          <ul>
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  isActive('/dashboard')
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-home mr-3"></i>
                <span>Home</span>
              </Link>
            </li>
            <li className="mt-1">
              <Link
                to="/groups"
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  isActive('/groups')
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-layer-group mr-3"></i>
                <span>Groups</span>
              </Link>
            </li>
            <li className="mt-1">
              <Link
                to="/enter-mood"
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  isActive('/enter-mood')
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-smile mr-3"></i>
                <span>How Are You Feeling?</span>
              </Link>
            </li>
            <li className="mt-1">
              <Link
                to="/group-mood"
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  isActive('/group-mood')
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-users mr-3"></i>
                <span>Group Mood</span>
              </Link>
            </li>
            <li className="mt-1">
              <Link
                to="/group-chat"
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  isActive('/group-chat')
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-comments mr-3"></i>
                <span>Group Chat</span>
              </Link>
            </li>
            <li className="mt-1">
              <Link
                to="/profile"
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  isActive('/profile')
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-user mr-3"></i>
                <span>Profile</span>
              </Link>
            </li>
            <li className="mt-1">
              <Link
                to="/settings"
                className={`flex items-center w-full px-4 py-3 rounded-lg ${
                  isActive('/settings')
                    ? 'bg-indigo-100 text-indigo-700 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <i className="fas fa-cog mr-3"></i>
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;