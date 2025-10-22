/**
 * ThemeContext - Manages application theme state
 * Provides dark/light theme switching functionality across the app
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeValue) => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('dark', 'light');
    
    if (themeValue === 'dark') {
      root.classList.add('dark');
      setIsDark(true);
    } else {
      // Default to light theme
      root.classList.add('light');
      setIsDark(false);
    }
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const value = {
    theme,
    isDark,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
