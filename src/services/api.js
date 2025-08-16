import axios from 'axios';

const api = axios.create({
  baseURL: 'https://inventorybackend-loop.onrender.com/', // The port where json-server will run
});

// Add a request interceptor
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
