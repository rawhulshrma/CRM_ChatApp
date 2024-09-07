import { createSlice } from '@reduxjs/toolkit';
import {
  loginOwner,
  logoutOwner,
  checkAuthOwner,
  updateOwnerProfile,
  clearErrors,
  clearMessages
} from '../action/ownerAction';

const initialState = {
  owner: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
};

const ownerSlice = createSlice({
  name: 'owner',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      // Login Owner
      .addCase(loginOwner.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.owner = action.payload;
        state.isAuthenticated = true;
        state.message = 'Logged in successfully';
      })
      .addCase(loginOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout Owner
      .addCase(logoutOwner.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutOwner.fulfilled, (state) => {
        state.loading = false;
        state.owner = null;
        state.isAuthenticated = false;
        state.message = 'Logged out successfully';
      })
      .addCase(logoutOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Auth
      .addCase(checkAuthOwner.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthOwner.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.owner = action.payload;
      })
      .addCase(checkAuthOwner.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.owner = null;
        state.error = action.payload;
      })

      // Update Owner Profile
      .addCase(updateOwnerProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOwnerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.owner = action.payload;
        state.message = 'Profile updated successfully';
      })
      .addCase(updateOwnerProfile.rejected, (state, action) => {
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

export default ownerSlice.reducer;
