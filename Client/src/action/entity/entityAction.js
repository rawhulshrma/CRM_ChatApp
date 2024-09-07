// src/actions/entityActions.js

import axios from 'axios';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

const createEntityAction = (entityName) => {
  const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);

  return {
    create: createAsyncThunk(
      `${entityName}/create${capitalizedName}`,
      async (data, { rejectWithValue }) => {
        try {
          const response = await axios.post(`/api/v1/${entityName}/create`, data);
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || `Failed to create ${entityName}`);
        }
      }
    ),

    login: createAsyncThunk(
      `${entityName}/login${capitalizedName}`,
      async (credentials, { dispatch, rejectWithValue }) => {
        try {
          const response = await axios.post(`/api/v1/${entityName}/login`, credentials);
          const { token, [entityName]: entity } = response.data;
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          dispatch(checkAuth(entityName));
          return entity;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || `${capitalizedName} Login Failed`);
        }
      }
    ),

    logout: createAsyncThunk(
      `${entityName}/logout${capitalizedName}`,
      async (_, { rejectWithValue }) => {
        try {
          const response = await axios.get(`/api/v1/${entityName}/logout`);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || `${capitalizedName} logout failed`);
        }
      }
    ),

    checkAuth: createAsyncThunk(
      `${entityName}/checkAuth`,
      async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`/api/v1/${entityName}/me`);
            return response.data[entityName];
          } catch (error) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            return rejectWithValue(error.response?.data?.message || 'Authentication failed');
          }
        }
        return rejectWithValue('No token found');
      }
    ),

    getDetails: createAsyncThunk(
      `${entityName}/get${capitalizedName}Details`,
      async (_, { rejectWithValue }) => {
        try {
          const response = await axios.get(`/api/v1/${entityName}/me`, { withCredentials: true });
          return response.data[entityName];
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || `Failed to fetch ${entityName} details`);
        }
      }
    ),

    fetchAll: createAsyncThunk(
      `${entityName}/fetchAll${capitalizedName}s`,
      async (_, { rejectWithValue }) => {
        try {
          const response = await axios.get(`/api/v1/${entityName}/all`);
          return response.data[`${entityName}s`];
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || `Failed to fetch ${entityName}s`);
        }
      }
    ),

    updateProfile: createAsyncThunk(
      `${entityName}/updateProfile`,
      async (profileData, { rejectWithValue }) => {
        try {
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          const response = await axios.put(`/api/v1/${entityName}/me/update`, profileData, config);
          return response.data[entityName];
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || error.message);
        }
      }
    ),
  };
};

export const adminActions = createEntityAction('admin');
export const managerActions = createEntityAction('manager');
export const employeeActions = createEntityAction('employee');


export const clearErrors = createAction('entity/clearErrors');
export const clearMessages = createAction('entity/clearMessages');


