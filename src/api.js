import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://masar-backend-oxnm.onrender.com/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('masar_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export async function loginRequest(username, password) {
  const res = await api.post('/auth/login/', { username, password });
  return res.data;
}

export async function logoutRequest() {
  try {
    await api.post('/auth/logout/');
  } catch (_) {
    // ignore logout failure
  }
}
