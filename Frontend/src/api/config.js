import axios from 'axios';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api' 
  : 'https://expense-tracker-3fvx.vercel.app/api';

// Configure axios to include credentials (cookies) for all requests
axios.defaults.withCredentials = true;

export const apiClient = axios.create({
  baseURL: API_URL,
});

export default apiClient;
