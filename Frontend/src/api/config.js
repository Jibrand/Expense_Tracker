import axios from 'axios';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : 'https://expense-tracker-3fvx.vercel.app/api';

// Configure axios to include credentials (cookies) for all requests
axios.defaults.withCredentials = true;

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Automatically inject JWT token from localStorage into Authorization headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
