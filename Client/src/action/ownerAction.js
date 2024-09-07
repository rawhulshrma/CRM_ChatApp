import axios from 'axios';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

// Login Owner

export const loginOwner = createAsyncThunk(
  'owner/loginOwner',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/owner/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Logout Owner
export const logoutOwner = createAsyncThunk(
  'owner/logoutOwner',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/owner/logout');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Owner Logout Failed');
    }
  }
);

// Check Owner Authentication
export const checkAuthOwner = createAsyncThunk(
  'owner/checkAuthOwner',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/api/v1/owner/me');
        return response.data.owner;
      } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        return rejectWithValue(error.response?.data?.message || 'Authentication Failed');
      }
    }
    return rejectWithValue('No Token Found');
  }
);

export const getOwnerDetails = createAsyncThunk(
  'owner/getOwnerDetails',
  async (profileData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await axios.get('/api/v1/owner/me/', profileData, config);
      return response.data.owner;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile Update Failed');
    }
  }
);



// Update Owner Profile
export const updateOwnerProfile = createAsyncThunk(
  'owner/updateOwnerProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      const response = await axios.put('/api/v1/owner/me/update', profileData, config);
      return response.data.owner;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile Update Failed');
    }
  }
);

// Clear Errors
export const clearErrors = createAction('owner/clearErrors');
export const clearMessages = createAction('owner/clearMessages');
