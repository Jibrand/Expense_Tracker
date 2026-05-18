import apiClient from './config';

export const transactionApi = {
  getTransactions: (bookId) => apiClient.get(`/transactions?bookId=${bookId}`).then(res => res.data),
  createTransaction: (data) => apiClient.post('/transactions', data).then(res => res.data),
  updateTransaction: (id, data) => apiClient.put(`/transactions/${id}`, data).then(res => res.data),
  deleteTransaction: (id) => apiClient.delete(`/transactions/${id}`).then(res => res.data),
};
