import axios, { AxiosError } from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: '/api/v1', // Changed to use the proxy
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Explicitly set to false
  timeout: 10000, // 10 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error('[API] Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('[API] No response received:', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
      });
    } else {
      console.error('[API] Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
