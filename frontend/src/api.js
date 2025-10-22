// src/api.js
import axios from 'axios';
const api = axios.create({ baseURL: `${process.env.REACT_APP_API_URL}` });
/*api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token');
  if (t) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});*/

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
