// entityAction.js
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
          return response.data.data; // Use .data property
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

// Create actions for currencies
export const currencyActions = createEntityAction('currency');

// Create actions for taxes
export const taxActions = createEntityAction('tax');

// Clear errors and messages
export const clearErrors = createAction('entity/clearErrors');
export const clearMessages = createAction('entity/clearMessages');