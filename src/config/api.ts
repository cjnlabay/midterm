import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Define base API URL dynamically for emulators & physical devices
const API_BASE_URL = 'http://localhost:3000/api/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

// API functions
export const getUsers = async () => {
  const { data } = await api.get('/product');
  return data;
};

export const getUserById = async (id) => { // Removed TypeScript-specific `: number`
  const { data } = await api.get(`/products/${id}`);
  return data;
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/products/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/products/login', credentials);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createUser = async (fullname, username, email, password) => {
  await api.post('/products', { fullname, username,  email,password });
};

export const updateUser = async (id, fullname, username, email, password) => {
  await api.put(`/products/${id}`, { fullname,username, email, password });
};

export const deleteUser = async (id) => {
  await api.delete(`/products/${id}`);
};

export default api;
