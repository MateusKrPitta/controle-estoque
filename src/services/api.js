import axios from 'axios';

const baseAPI = process.env.REACT_APP_BASE_API || 'http://localhost:3333/api/v1';

const api = axios.create({
  baseURL: baseAPI,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

