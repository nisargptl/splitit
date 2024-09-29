import apiClient from '../index';

export const uploadUser = async () => {
    try {
      const response = await apiClient.post('/api/user');
      localStorage.setItem("userId", response.data.user._id);
      return response.data;
    } catch (error) {
      throw error;
    }
  };