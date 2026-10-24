import axiosClient from './axiosClient';

export const budgetApi = {
  getBudgets: async (month, year) => {
    const response = await axiosClient.get('/budgets', {
      params: { month, year },
    });
    return response.data;
  },
  setBudget: async (data) => {
    const response = await axiosClient.post('/budgets', data);
    return response.data;
  },
  deleteBudget: async (id) => {
    const response = await axiosClient.delete(`/budgets/${id}`);
    return response.data;
  },
};

