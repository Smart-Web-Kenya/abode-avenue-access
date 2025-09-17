import api from '@/lib/api';

// Remove the leading slash since the base URL already includes /api
const API_URL = 'v1';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'client';
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
  bio?: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  lastLogin?: string;
  propertiesCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Get all users
export const getUsers = async (params?: {
  role?: string;
  status?: string;
  search?: string;
}): Promise<{ success: boolean; data: User[] }> => {
  const response = await api.get(`${API_URL}/users`, { params });
  return response.data;
};

// Get single user
export const getUser = async (id: string): Promise<{ success: boolean; data: User }> => {
  const response = await api.get(`${API_URL}/users/${id}`);
  return response.data;
};

// Create user
export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: string;
  status?: string;
}): Promise<{ success: boolean; data: User }> => {
  const response = await api.post(`${API_URL}/users`, userData);
  return response.data;
};

// Update user
export const updateUser = async (
  id: string,
  userData: Partial<{
    name: string;
    email: string;
    password: string;
    role: string;
    status: string;
    phone: string;
    bio: string;
  }>
): Promise<{ success: boolean; data: User }> => {
  const response = await api.put(`${API_URL}/users/${id}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (id: string): Promise<{ success: boolean; data: {} }> => {
  const response = await api.delete(`${API_URL}/users/${id}`);
  return response.data;
};

// Toggle user status
export const toggleUserStatus = async (id: string): Promise<{ success: boolean; data: User }> => {
  const response = await api.patch(`${API_URL}/users/${id}/status`);
  return response.data;
};

// Get current user
export const getCurrentUser = async (): Promise<{ success: boolean; data: User }> => {
  const response = await api.get(`${API_URL}/users/me`);
  return response.data;
};

// Update profile
export const updateProfile = async (
  userData: Partial<{
    name: string;
    email: string;
    phone: string;
    bio: string;
    avatar: File;
  }>
): Promise<{ success: boolean; data: User }> => {
  const formData = new FormData();
  
  if (userData.name) formData.append('name', userData.name);
  if (userData.email) formData.append('email', userData.email);
  if (userData.phone) formData.append('phone', userData.phone);
  if (userData.bio) formData.append('bio', userData.bio);
  if (userData.avatar) formData.append('avatar', userData.avatar);
  
  const response = await api.put(`${API_URL}/users/me`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Change password
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(`${API_URL}/users/change-password`, data);
  return response.data;
};

// Forgot password
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`${API_URL}/auth/forgot-password`, { email });
  return response.data;
};

// Reset password
export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(`${API_URL}/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return response.data;
};
