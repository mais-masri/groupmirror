import axios from 'axios';

// Demo mode - use mock API responses when backend is unavailable
const DEMO_MODE = false; // Set to false when backend is deployed

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = axios.create({ baseURL: API_URL, timeout: 8000 });

console.log('[API] baseURL =', process.env.REACT_APP_API_URL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (DEMO_MODE) {
      // In demo mode, simulate successful responses
      console.log('[DEMO] Simulating API response for:', error.config?.url);
      return Promise.resolve({ data: { success: true, message: 'Demo mode - operation successful' } });
    }
    
    // Enhanced error handling
    let message = 'Something went wrong. Please try again.';
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      switch (status) {
        case 401:
          message = 'Please log in to continue.';
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 422:
          message = error.response.data?.message || 'Invalid data provided.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = error.response.data?.message || error.response.data?.error || `Server error (${status})`;
      }
    } else if (error.request) {
      // Network error
      message = 'Unable to connect to server. Please check your internet connection.';
    } else {
      // Other error
      message = error.message || 'An unexpected error occurred.';
    }
    
    console.error('[API Error]', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message
    });
    
    throw new Error(message);
  }
);

export default api;
