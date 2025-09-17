import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://real_estate_api.test/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  timeout: 15000, // 15 seconds
});

// Helper function to get auth token
const getAuthToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Request interceptor to add auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token using our helper function
    const token = getAuthToken();
    
    // If token exists, add it to the Authorization header
    if (token) {
      // Ensure headers object exists with proper type
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      
      // Set the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
      
      // Log the request (only in development)
      if (import.meta.env.DEV) {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          params: config.params,
          data: config.data,
        });
      }
    } else {
      console.warn('No auth token found for request:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login');
      // You might want to redirect to login page here
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
