import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'https://cave-tech-task.vercel.app';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});


api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in interceptor:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
   
    if (error.response && error.response.status === 401) {
     
    }
    return Promise.reject(error);
  }
);


const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    
    console.log('Response data:', error.response.data);
    console.log('Response status:', error.response.status);
    return error.response.data;
  } else if (error.request) {
    
    console.log('Request error:', error.request);
    return { error: 'Network error - no response received' };
  } else {
    
    console.log('Error message:', error.message);
    return { error: 'Request setup error' };
  }
};


export const signup = async (name, email, password) => {
  try {
    console.log('Attempting signup to:', API_URL);
    const response = await api.post('/auth/signup', { name, email, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const login = async (email, password) => {
  try {
    console.log('Attempting login to:', API_URL);
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const logout = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.error('Logout error:', error);
  }
};


export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const fetchTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const getTask = async (id) => {
  try {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const updateTask = async (id, taskData) => {
  try {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const toggleTaskCompletion = async (id) => {
  try {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

export default api;