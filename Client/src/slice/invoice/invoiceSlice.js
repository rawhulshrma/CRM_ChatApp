// src/slices/invoiceSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { invoiceActions, proformaInvoiceActions, clearErrors, clearMessages } from '../../action/invoice/invoiceAction';

const createEntitySlice = (entityName, actions) => {
  const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const initialState = {
    [entityName]: null,
    [`${entityName}s`]: [],
    loading: false,
    error: null,
    message: null,
    lastUpdated: null,
  };

  return createSlice({
    name: entityName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(actions.fetchAll.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(actions.fetchAll.fulfilled, (state, action) => {
          state.loading = false;
          state[`${entityName}s`] = action.payload;
          state.lastUpdated = new Date().toISOString();
          state.message = `${capitalizedName}s fetched successfully`;
        })
        .addCase(actions.fetchAll.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.getDetails.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(actions.getDetails.fulfilled, (state, action) => {
          state.loading = false;
          state[entityName] = action.payload;
          state.lastUpdated = new Date().toISOString();
        })
        .addCase(actions.getDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.add.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(actions.add.fulfilled, (state, action) => {
          state.loading = false;
          state[`${entityName}s`].push(action.payload);
          state.lastUpdated = new Date().toISOString();
          state.message = `${capitalizedName} added successfully`;
        })
        .addCase(actions.add.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.update.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(actions.update.fulfilled, (state, action) => {
          state.loading = false;
          const index = state[`${entityName}s`].findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state[`${entityName}s`][index] = action.payload;
          }
          state.lastUpdated = new Date().toISOString();
          state.message = `${capitalizedName} updated successfully`;
        })
        .addCase(actions.update.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.delete.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(actions.delete.fulfilled, (state, action) => {
          state.loading = false;
          state[`${entityName}s`] = state[`${entityName}s`].filter(item => item.id !== action.payload);
          state.lastUpdated = new Date().toISOString();
          state.message = `${capitalizedName} deleted successfully`;
        })
        .addCase(actions.delete.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(clearErrors, (state) => {
          state.error = null;
        })
        .addCase(clearMessages, (state) => {
          state.message = null;
        });
    },
  });
};

export const invoiceSlice = createEntitySlice('invoice', invoiceActions);
export const proformaInvoiceSlice = createEntitySlice('proformaInvoice', proformaInvoiceActions);

export const invoiceReducer = invoiceSlice.reducer;
export const proformaInvoiceReducer = proformaInvoiceSlice.reducer;