import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const loginEmployee = createAsyncThunk(
  'employee/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/employee/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutEmployee = createAsyncThunk(
  'employee/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/employee/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employee/create',
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/employee/create', employeeData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getEmployeeDetails = createAsyncThunk(
  'employee/getDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/employee/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEmployeeProfile = createAsyncThunk(
  'employee/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/v1/employee/me/update', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employee/delete',
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/v1/employee/${employeeId}/delete`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateEmployeeRole = createAsyncThunk(
  'employee/updateRole',
  async ({ employeeId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/v1/employee/${employeeId}/role`, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
