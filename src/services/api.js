import axios from 'axios';

// Demo mode - use mock API responses when backend is unavailable
const DEMO_MODE = true; // Set to false when backend is deployed

const API_URL = DEMO_MODE 
  ? 'https://jsonplaceholder.typicode.com' // Mock API for demo
  : ((typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
     process.env.REACT_APP_API_URL ||
     'http://localhost:3001');

export const api = axios.create({ baseURL: API_URL });

console.log('[API] baseURL =', API_URL, DEMO_MODE ? '(DEMO MODE)' : '');

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
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'API request failed';
    throw new Error(message);
  }
);

export default api;
