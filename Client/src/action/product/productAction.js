import axios from 'axios';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8080/api/v1';

const handleError = (error, defaultMessage) => {
  if (error.response) {
    return error.response.data.message || defaultMessage;
  } else if (error.request) {
    return 'No response received from server';
  } else {
    return error.message || defaultMessage;
  }
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page
    }
    return Promise.reject(error);
  }
);

const createEntityAction = (entityName) => {
  const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);

  return {
    create: createAsyncThunk(
      `${entityName}/create${capitalizedName}`,
      async (data, { rejectWithValue }) => {
        try {
          const response = await axios.post(`${API_URL}/${entityName}`, data);
          return response.data;
        } catch (error) {
          return rejectWithValue(handleError(error, `Failed to create ${entityName}`));
        }
      }
    ),

    fetchAll: createAsyncThunk(
      `${entityName}/fetchAll${capitalizedName}s`,
      async (_, { rejectWithValue }) => {
        try {
          const response = await axios.get(`${API_URL}/${entityName}/all`);
          console.log('API Response:', response.data);
          return response.data.data; // यहाँ .data प्रॉपर्टी का उपयोग करें
        } catch (error) {
          return rejectWithValue(handleError(error, `Failed to fetch ${entityName}s`));
        }
      }
    ),

    fetchById: createAsyncThunk(
      `${entityName}/fetch${capitalizedName}ById`,
      async (id, { rejectWithValue }) => {
        try {
          const response = await axios.get(`${API_URL}/${entityName}/${id}`);
          return response.data[entityName];
        } catch (error) {
          return rejectWithValue(handleError(error, `Failed to fetch ${entityName}`));
        }
      }
    ),

    update: createAsyncThunk(
      `${entityName}/update${capitalizedName}`,
      async ({ id, data }, { rejectWithValue }) => {
        try {
          const response = await axios.put(`${API_URL}/${entityName}/${id}`, data);
          return response.data;
        } catch (error) {
          return rejectWithValue(handleError(error, `Failed to update ${entityName}`));
        }
      }
    ),

    remove: createAsyncThunk(
      `${entityName}/remove${capitalizedName}`,
      async (id, { rejectWithValue }) => {
        try {
          await axios.delete(`${API_URL}/${entityName}/${id}`);
          return id;
        } catch (error) {
          return rejectWithValue(handleError(error, `Failed to delete ${entityName}`));
        }
      }
    ),
  };
};

export const productActions = createEntityAction('product');
export const productCategoryActions = createEntityAction('productCategory');

export const clearErrors = createAction('entity/clearErrors');
export const clearMessages = createAction('entity/clearMessages');