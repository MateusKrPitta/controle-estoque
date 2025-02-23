import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333/api/v1', // Certifique-se de que a URL esteja correta
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;