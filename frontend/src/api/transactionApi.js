import axiosClient from './axiosClient';

export const transactionApi = {
  getTransactions: async (params = {}) => {
    const response = await axiosClient.get('/transactions', { params });
    return response.data;
  },
  getTransactionById: async (id) => {
    const response = await axiosClient.get(`/transactions/${id}`);
    return response.data;
  },
  createTransaction: async (data) => {
    const response = await axiosClient.post('/transactions', data);
    return response.data;
  },
  updateTransaction: async (id, data) => {
    const response = await axiosClient.put(`/transactions/${id}`, data);
    return response.data;
  },
  deleteTransaction: async (id) => {
    const response = await axiosClient.delete(`/transactions/${id}`);
    return response.data;
  },
};

