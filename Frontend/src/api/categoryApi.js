import apiClient from './config';

export const categoryApi = {
  getCategories: () => apiClient.get('/categories').then(res => res.data),
  createCategory: (data) => apiClient.post('/categories', data).then(res => res.data),
  updateCategory: (id, data) => apiClient.put(`/categories/${id}`, data).then(res => res.data),
  deleteCategory: (id) => apiClient.delete(`/categories/${id}`).then(res => res.data),
};
