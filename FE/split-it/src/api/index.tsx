import axios from 'axios';

export const backendUrl = 'http://localhost:9000';
console.log(backendUrl)

const apiClient = axios.create({
  baseURL: backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically include the token in headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
