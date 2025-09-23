import api from '@/lib/api';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
  // Add other user properties as needed
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData extends LoginCredentials {
  name: string;
  // Add other registration fields as needed
}

// Set auth token in localStorage and axios defaults
export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Store user data in localStorage
export const setUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

// Get current user from localStorage
export const getCurrentUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('users/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const { token, user } = response.data;
    
    // Set token and user data
    setAuthToken(token);
    setUser(user);
    
    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register new user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('users/register', userData);
    
    const { token, user } = response.data;
    
    // Set token and user data
    setAuthToken(token);
    setUser(user);
    
    return { token, user };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout user
export const logout = (): void => {
  // Clear all auth data
  setAuthToken(null);
  setUser(null);
  
  // Clear any other stored data if needed
  // localStorage.clear(); // Be careful with this as it clears everything
};

// Get current user (makes an API call)
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>('/users/me');
    const user = response.data;
    
    // Update user data in localStorage
    setUser(user);
    
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

// Check if user has specific role(s)
export const hasRole = (user: User | null, roles: string | string[]): boolean => {
  if (!user) return false;
  
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  
  return user.role === roles;
};

// Check if user is admin
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

// Check if user is agent
export const isAgent = (user: User | null): boolean => {
  return hasRole(user, 'agent');
};

// Check if user is admin or agent
export const isAdminOrAgent = (user: User | null): boolean => {
  return hasRole(user, ['admin', 'agent']);
};
