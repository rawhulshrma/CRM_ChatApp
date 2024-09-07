// src/slice/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  fetchAllAdmins, // Import here
  checkAuth,
  getAdminDetails,
  clearErrors,
  clearMessages,
} from '../action/adminAction'; // Ensure these actions are correctly exported from adminAction.js

const initialState = {
  admins: [], // Add a list for all admins
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Admin
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
        state.message = 'Admin created successfully';
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login Admin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
        state.message = 'Logged in successfully';
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout Admin
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.admin = null;
        state.isAuthenticated = false;
        state.message = 'Logged out successfully';
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = action.payload;
      })

      // Get Admin Details
      .addCase(getAdminDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAdminDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getAdminDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Fetch All Admins
      .addCase(fetchAllAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload; // Update the list of admins
      })
      .addCase(fetchAllAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Errors
      .addCase(clearErrors, (state) => {
        state.error = null;
      })

      // Clear Messages
      .addCase(clearMessages, (state) => {
        state.message = null;
      });
  }
});

export default adminSlice.reducer;
