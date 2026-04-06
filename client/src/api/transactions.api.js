import api from './axios';

export const transactionsApi = {
  getTransactions: (filters) => api.get('/transactions', { params: filters }),
  getTransactionById: (id) => api.get(`/transactions/${id}`),
  createTransaction: (data) => api.post('/transactions', data),
  updateTransaction: (id, data) => api.patch(`/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/transactions/${id}`),
};
