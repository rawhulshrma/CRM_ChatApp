// src/actions/invoiceActions.js
import axios from 'axios';
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // Importing uuidv4 to generate unique IDs

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred with the server response.';
  } else if (error.request) {
    return 'No response received from the server. Please check your network connection.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};

// Helper function to validate invoice data
const validateInvoiceData = (data) => {
  const requiredFields = ['clientId', 'items', 'totalAmount', 'dueDate'];
  for (let field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  if (data.items.length === 0) {
    throw new Error('Invoice must have at least one item');
  }
  if (data.totalAmount <= 0) {
    throw new Error('Total amount must be greater than zero');
  }
};

// Factory function to create actions for both invoice and proformaInvoice
const createInvoiceAction = (invoiceType) => {
  const capitalizedName = invoiceType.charAt(0).toUpperCase() + invoiceType.slice(1);

  return {
    fetchAll: createAsyncThunk(
      `${invoiceType}/fetchAll${capitalizedName}s`,
      async (_, { rejectWithValue }) => {
        try {
          const response = await axios.get(`/api/v1/${invoiceType}/all`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          return response.data.data;
        } catch (error) {
          return rejectWithValue(handleApiError(error));
        }
      }
    ),
    getDetails: createAsyncThunk(
      `${invoiceType}/get${capitalizedName}Details`,
      async (id, { rejectWithValue }) => {
        try {
          const response = await axios.get(`/api/v1/${invoiceType}/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          return response.data;
        } catch (error) {
          return rejectWithValue(handleApiError(error));
        }
      }
    ),
    add: createAsyncThunk(
      `${invoiceType}/add${capitalizedName}`,
      async (invoiceData, { rejectWithValue }) => {
        try {
          // Generate a unique ID using uuidv4
          invoiceData.id = uuidv4();
          validateInvoiceData(invoiceData);
          const response = await axios.post(`/api/v1/${invoiceType}`, invoiceData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          return response.data;
        } catch (error) {
          return rejectWithValue(handleApiError(error));
        }
      }
    ),
    update: createAsyncThunk(
      `${invoiceType}/update${capitalizedName}`,
      async ({ id, updateData }, { rejectWithValue }) => {
        try {
          validateInvoiceData(updateData);
          const response = await axios.put(`/api/v1/${invoiceType}/${id}/update`, updateData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          });
          return response.data;
        } catch (error) {
          return rejectWithValue(handleApiError(error));
        }
      }
    ),
    delete: createAsyncThunk(
      `${invoiceType}/delete${capitalizedName}`,
      async (id, { rejectWithValue }) => {
        try {
          const response = await axios.delete(`/api/v1/${invoiceType}/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          return id; // Return the ID of the deleted invoice
        } catch (error) {
          return rejectWithValue(handleApiError(error));
        }
      }
    ),
  };
};

// Actions for invoice and proformaInvoice
export const invoiceActions = createInvoiceAction('invoice');
export const proformaInvoiceActions = createInvoiceAction('proformaInvoice');

// Common actions for clearing errors and messages
export const clearErrors = createAction('invoice/clearErrors');
export const clearMessages = createAction('invoice/clearMessages');
