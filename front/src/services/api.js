import axios from 'axios';

// Detectar entorno automáticamente
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : '/api'; // En producción, usar ruta relativa

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autorización
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
  getStats: (params) => api.get('/categories/stats', { params }),
};

// Expenses API
export const expensesAPI = {
  getAll: (params) => api.get('/expenses', { params }),
  create: (expenseData) => api.post('/expenses', expenseData),
  update: (id, expenseData) => api.put(`/expenses/${id}`, expenseData),
  delete: (id) => api.delete(`/expenses/${id}`),
  getStats: (params) => api.get('/expenses/stats/summary', { params }),
  getStatsByPeriod: (params) => api.get('/expenses/stats/period', { params }),
  getCategoryStats: (period = 'month') => api.get(`/expenses/stats/categories?period=${period}`),
  getMonthlyStats: () => api.get('/expenses/stats/monthly'),
};

// Settings API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settingsData) => api.put('/settings', settingsData),
  updateProfile: (profileData) => api.put('/settings/profile', profileData),
  changePassword: (passwordData) => api.put('/settings/password', passwordData),
};

export default api;