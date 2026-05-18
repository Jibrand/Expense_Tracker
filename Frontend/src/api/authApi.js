import apiClient from './config';

export const authApi = {
  checkAuth: () => apiClient.get('/auth/me').then(res => res.data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }).then(res => res.data),
  register: (name, email, password, bookName) => apiClient.post('/auth/register', { name, email, password, bookName }).then(res => res.data),
  logout: () => apiClient.post('/auth/logout').then(res => res.data),
};
