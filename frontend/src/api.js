// src/api.js
import axios from 'axios';
const api = axios.create({ baseURL: `${process.env.REACT_APP_API_URL}/auth/login` });

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

export default api;
