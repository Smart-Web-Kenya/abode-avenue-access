import axios from 'axios';
import { User } from './userService';

const API_URL = 'http://localhost:3000/api/v1';

// Set auth token in axios headers and localStorage
export const setAuthToken = (token: string | null): void => {
  if (token) {
    // Apply to every request
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // Save to localStorage
    localStorage.setItem('token', token);
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization'];
    // Remove from localStorage
    localStorage.removeItem('token');
  }
};

// Initialize auth state from localStorage
export const initializeAuth = (): string | null => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
  }
  return token;
};

// Login user
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, credentials);
  const { token, user } = response.data;
  
  // Set token in axios headers and localStorage
  setAuthToken(token);
  
  // Store user data in localStorage if rememberMe is true
  if (credentials.rememberMe) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  return { success: true, token, user };
};

// Logout user
export const logout = (): void => {
  // Remove token from axios headers and localStorage
  setAuthToken(null);
  // Remove user data from localStorage
  localStorage.removeItem('user');
};

// Register user
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'client' | 'agent';
}

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/auth/register`, userData);
  const { token, user } = response.data;
  
  // Set token in axios headers and localStorage
  setAuthToken(token);
  
  return { success: true, token, user };
};

// Verify email
export const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
  return response.data;
};

// Resend verification email
export const resendVerificationEmail = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${API_URL}/auth/resend-verification-email`, { email });
  return response.data;
};

// Get current user from localStorage
export const getCurrentUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Check if user has required role
export const hasRole = (roles: string | string[]): boolean => {
  const user = getCurrentUserFromStorage();
  if (!user) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};
