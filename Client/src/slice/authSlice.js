import { createSlice } from '@reduxjs/toolkit';
import { login, getMe, logout, checkAuth, update } from '../action/auth/authAction';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  isAuthenticated: false,
  error: null,
  message: null,
  userLoaded: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    clearMessages: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = localStorage.getItem('token');
        state.isAuthenticated = true;
        state.loading = false;
        state.userLoaded = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.userLoaded = true;
      })
      .addCase(update.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.message = 'Profile updated successfully';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.userLoaded = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.userLoaded = true;
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearErrors, clearMessages } = authSlice.actions;
export default authSlice.reducer;