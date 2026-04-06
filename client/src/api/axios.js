import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      // Auto logout on 401
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }

      // Handle other errors
      if (status === 403) {
        toast.error('You don\'t have permission to do this');
      } else if (status === 404) {
        toast.error('Resource not found');
      } else if (data && data.error) {
        toast.error(data.error);
      } else {
        toast.error('An unexpected error occurred');
      }

      return Promise.reject(data || { success: false, error: 'Network error' });
    }

    toast.error('Unable to connect to server. Visit /status for System Diagnostic Mode.');
    return Promise.reject({ success: false, error: 'Connection failed' });
  }
);

export default api;
