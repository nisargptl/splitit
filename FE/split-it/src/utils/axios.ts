import axios, { AxiosInstance } from 'axios';

// Create an Axios instance
export const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:9000',
});

export default api;