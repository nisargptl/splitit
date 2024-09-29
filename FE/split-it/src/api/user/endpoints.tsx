import apiClient from '../index';

export const uploadUser = async () => {
    try {
      const response = await apiClient.post('/api/user');
      return response.data;  // Return the data (like access_token)
    } catch (error) {
      throw error;  // Propagate the error for the caller to handle
    }
  };