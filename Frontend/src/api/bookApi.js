import apiClient from './config';

export const bookApi = {
  getBooks: () => apiClient.get('/books').then(res => res.data),
  createBook: (name) => apiClient.post('/books', { name }).then(res => res.data),
  deleteBook: (id) => apiClient.delete(`/books/${id}`).then(res => res.data),
};

export const settingApi = {
  getSettings: () => apiClient.get('/settings').then(res => res.data),
  updateSettings: (data) => apiClient.post('/settings', data).then(res => res.data),
};
