// src/slices/entitySlice.js

import { createSlice } from '@reduxjs/toolkit';
import { adminActions, managerActions, employeeActions, clearErrors, clearMessages } from '../../action/entity/entityAction';

const createEntitySlice = (entityName, actions) => {
  const capitalizedName = entityName.charAt(0).toUpperCase() + entityName.slice(1);
  const initialState = {
    [entityName]: null,
    [`${entityName}s`]: [],
    isAuthenticated: false,
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
          state.isAuthenticated = true;
          state.message = `${capitalizedName} created successfully`;
        })
        .addCase(actions.create.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.login.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.login.fulfilled, (state, action) => {
          state.loading = false;
          state[entityName] = action.payload;
          state.isAuthenticated = true;
          state.message = 'Logged in successfully';
        })
        .addCase(actions.login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.logout.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.logout.fulfilled, (state) => {
          state.loading = false;
          state[entityName] = null;
          state.isAuthenticated = false;
          state.message = 'Logged out successfully';
        })
        .addCase(actions.logout.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.checkAuth.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.checkAuth.fulfilled, (state, action) => {
          state.loading = false;
          state.isAuthenticated = true;
          state[entityName] = action.payload;
        })
        .addCase(actions.checkAuth.rejected, (state, action) => {
          state.loading = false;
          state.isAuthenticated = false;
          state[entityName] = null;
          state.error = action.payload;
        })

        .addCase(actions.getDetails.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.getDetails.fulfilled, (state, action) => {
          state.loading = false;
          state[entityName] = action.payload;
          state.isAuthenticated = true;
        })
        .addCase(actions.getDetails.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.isAuthenticated = false;
        })

        .addCase(actions.fetchAll.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.fetchAll.fulfilled, (state, action) => {
          state.loading = false;
          state[`${entityName}s`] = action.payload;
        })
        .addCase(actions.fetchAll.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.updateProfile.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.updateProfile.fulfilled, (state, action) => {
          state.loading = false;
          state[entityName] = action.payload;
          state.message = 'Profile updated successfully';
        })
        .addCase(actions.updateProfile.rejected, (state, action) => {
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

export const adminSlice = createEntitySlice('admin', adminActions);
export const managerSlice = createEntitySlice('manager', managerActions);
export const employeeSlice = createEntitySlice('employee', employeeActions);

// Export the reducers directly
export const adminReducer = adminSlice.reducer;
export const managerReducer = managerSlice.reducer;
export const employeeReducer = employeeSlice.reducer;
