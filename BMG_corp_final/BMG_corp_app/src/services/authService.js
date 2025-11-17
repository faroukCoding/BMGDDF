import apiClient from './api';

const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const register = async (userData) => {
  try {
    // Defaulting role to 'affiliate' for now as per typical use case.
    // This can be expanded later.
    const response = await apiClient.post('/auth/register', { ...userData, role: 'affiliate' });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const authService = {
  login,
  register,
};
