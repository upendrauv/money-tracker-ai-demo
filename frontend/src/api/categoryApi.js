import axiosClient from './axiosClient';

export const categoryApi = {
  getCategories: async (type) => {
    const response = await axiosClient.get('/categories', {
      params: type ? { type } : {},
    });
    return response.data;
  },
  createCategory: async (data) => {
    const response = await axiosClient.post('/categories', data);
    return response.data;
  },
};

