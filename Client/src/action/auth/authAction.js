import axios from 'axios';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

axios.defaults.baseURL = 'http://localhost:8080';

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/owner/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthToken(token);
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login Failed');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue, getState }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue('No token found');
    }
    setAuthToken(token);
    try {
      const { data } = await axios.get('/api/v1/owner/me');
      return data.owner;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

export const update = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      for (const key in profileData) {
        if (profileData[key] instanceof File) {
          formData.append(key, profileData[key]);
        } else {
          formData.append(key, profileData[key]);
        }
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const { data } = await axios.put('/api/v1/owner/me/update', formData, config);
      return data.data;
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }
    setAuthToken(token);
    try {
      const { data } = await axios.get('/api/v1/owner/me');
      return data.owner;
    } catch (error) {
      localStorage.removeItem('token');
      setAuthToken(null);
      return rejectWithValue(error.response?.data?.message || 'Failed to verify token');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.get('/api/v1/owner/logout');
      localStorage.removeItem('token');
      setAuthToken(null);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout Failed');
    }
  }
);

export const clearErrors = createAction('auth/clearErrors');
export const clearMessages = createAction('auth/clearMessages');