import api from './api';

class AuthService {
  // User registration
  async register(userData) {
    const { name, email, password } = userData;
    const result = await api.post('/api/auth/register', { name, email, password });
    return result.data;
  }

  // User login
  async login(email, password) {
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

