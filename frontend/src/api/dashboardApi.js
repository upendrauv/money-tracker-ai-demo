import axiosClient from './axiosClient';

export const dashboardApi = {
  getSummary: async () => {
    const response = await axiosClient.get('/dashboard');
    return response.data;
  },
};

