import axios from 'axios';

const api = axios.create({
  // Use environment variable for API base URL, with a fallback for existing setups.
  // The VITE_ prefix is required for Vite to expose it to the client-side code.
  baseURL: import.meta.env.VITE_API_URL || 'https://inventorybackend-loop.onrender.com/',
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
