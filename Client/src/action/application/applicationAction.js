
// applicationAction.js
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

    getAll: createAsyncThunk(
      `${entityName}/getAll${capitalizedName}s`,
      async (_, { rejectWithValue }) => {
        try {
          const response = await axios.get(`/api/v1/${entityName}/all`);
          // Assuming the API returns an object with the entity name as the key
          return response.data[entityName] || response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || `Failed to fetch ${entityName}s`);
        }
      }
    ),

    getById: createAsyncThunk(
      `${entityName}/get${capitalizedName}ById`,
      async (id, { rejectWithValue }) => {
        try {
          const response = await axios.get(`/api/v1/${entityName}/${id}`);
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || `Failed to fetch ${entityName} details`);
        }
      }
    ),

    update: createAsyncThunk(
      `${entityName}/update${capitalizedName}`,
      async ({ id, data }, { rejectWithValue }) => {
        try {
          const response = await axios.put(`/api/v1/${entityName}/${id}`, data);
          return response.data;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || `Failed to update ${entityName}`);
        }
      }
    ),

    delete: createAsyncThunk(
      `${entityName}/delete${capitalizedName}`,
      async (id, { rejectWithValue }) => {
        try {
          await axios.delete(`/api/v1/${entityName}/${id}`);
          return id;
        } catch (error) {
          return rejectWithValue(error.response?.data?.message || `Failed to delete ${entityName}`);
        }
      }
    ),
  };
};

export const companiesActions = createEntityAction('companies');
export const peopleActions = createEntityAction('people');
export const customerActions = createEntityAction('customer');

export const clearErrors = createAction('application/clearErrors');
export const clearMessages = createAction('application/clearMessages');