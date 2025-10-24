import api from './api';

/**
 * AuthService - Authentication Service
 * Provides user registration, login, logout, and profile management with JWT token handling,
 * automatic data transformation for backend API compatibility, and localStorage management.
 */

// Demo mode flag
const DEMO_MODE = false;

class AuthService {
  // User registration
  async register(userData) {
    if (DEMO_MODE) {
      // Demo mode - simulate successful registration
      const { name, email } = userData;
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        name,
        email,
        token: 'demo-token-' + Date.now()
      };
      
      // Store in localStorage
      localStorage.setItem('token', demoUser.token);
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      return { success: true, user: demoUser, token: demoUser.token };
    }
    
    const { name, email, password } = userData;
    
    // Split the name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Generate username from email (before @) or use firstName
    const username = email.split('@')[0] || firstName.toLowerCase();
    
    const result = await api.post('/api/auth/register', { 
      firstName, 
      lastName, 
      username, 
      email, 
      password 
    });
    return result.data;
  }

  // User login
  async login(email, password) {
    if (DEMO_MODE) {
      // Demo mode - simulate successful login
      const demoUser = {
        id: 'demo-user-' + Date.now(),
        name: email.split('@')[0],
        email,
        token: 'demo-token-' + Date.now()
      };
      
      // Store in localStorage
      localStorage.setItem('token', demoUser.token);
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      return { success: true, user: demoUser, token: demoUser.token };
    }
    
    const result = await api.post('/api/auth/login', { email, password });
    return result.data;
  }

  // User logout
  logout() {
    // Clear any user-related data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Get current user profile
  async getCurrentUser() {
    return api.get('/api/auth/profile');
  }

  // Update user profile
  async updateProfile(userData) {
    return api.put('/api/auth/profile', userData);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }
}

// Create and export a singleton instance
const authService = new AuthService();

// Export individual functions for easier use
export const registerUser = (userData) => authService.register(userData);
export const loginUser = (email, password) => authService.login(email, password);
export const logoutUser = () => authService.logout();

export default authService;

