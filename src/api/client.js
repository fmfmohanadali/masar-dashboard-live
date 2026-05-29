import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 
  'https://masar-backend-oxnm.onrender.com/api';

export const api = axios.create({
  baseURL,
  timeout: 30000,
});

// إضافة token تلقائياً
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// معالجة الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// دالة مساعدة لتنسيق البيانات
export function normalizeList(data) {
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  return [];
}

// دالة لتنظيف payload
export function cleanPayload(payload) {
  const output = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      output[key] = value;
    }
  });
  return output;
}
