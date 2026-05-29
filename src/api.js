import axios from 'axios';

// API base URL - قابل للتغيير من environment
const API_BASE = import.meta.env.VITE_API_BASE || 'https://masar-backend-oxnm.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

// إضافة Token تلقائياً
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('masar_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// ✅ معالجة الأخطاء تلقائياً
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ إذا انتهت الجلسة، redirect للـ login
    if (error.response?.status === 401) {
      localStorage.removeItem('masar_token');
      localStorage.removeItem('masar_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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

// ✅ دوال مساعدة للـ API
export function normalizeList(data) {
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  return [];
}

export function getErrorMessage(err) {
  return err?.response?.data?.message
    || err?.response?.data?.detail
    || err?.message
    || 'حدث خطأ غير متوقع';
}
