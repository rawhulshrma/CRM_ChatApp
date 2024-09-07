
// applicationSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { companiesActions, peopleActions, customerActions, clearErrors, clearMessages } from '../../action/application/applicationAction';

const createEntitySlice = (entityName, actions) => {
  const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const initialState = {
    [entityName]: null,
    [`${entityName}s`]: [],
    loading: false,
    error: null,
    message: null,
  };

  return createSlice({
    name: entityName,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(actions.create.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.create.fulfilled, (state, action) => {
          state.loading = false;
          state[entityName] = action.payload;
          state[`${entityName}s`].push(action.payload);
          state.message = `${capitalizedName} created successfully`;
        })
        .addCase(actions.create.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.getAll.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.getAll.fulfilled, (state, action) => {
          state.loading = false;
          state[`${entityName}s`] = action.payload;
        })
        .addCase(actions.getAll.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.getById.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.getById.fulfilled, (state, action) => {
          state.loading = false;
          state[entityName] = action.payload;
        })
        .addCase(actions.getById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.update.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.update.fulfilled, (state, action) => {
          state.loading = false;
          state[entityName] = action.payload;
          const index = state[`${entityName}s`].findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state[`${entityName}s`][index] = action.payload;
          }
          state.message = `${capitalizedName} updated successfully`;
        })
        .addCase(actions.update.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.delete.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.delete.fulfilled, (state, action) => {
          state.loading = false;
          state[`${entityName}s`] = state[`${entityName}s`].filter(item => item.id !== action.payload);
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

export const companiesSlice = createEntitySlice('companies', companiesActions);
export const peopleSlice = createEntitySlice('people', peopleActions);
export const customerSlice = createEntitySlice('customer', customerActions);

export const companiesReducer = companiesSlice.reducer;
export const peopleReducer = peopleSlice.reducer;
export const customerReducer = customerSlice.reducer;
