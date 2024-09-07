import axios from "axios";
import { createAsyncThunk, createAction } from '@reduxjs/toolkit';

// Add User
export const addUser = createAsyncThunk(
  'user/addUser',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/v1/users', userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Login User
// export const loginUser = createAsyncThunk(
//   'user/loginUser',
//   async (loginData, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.post('/api/v1/users/login', loginData);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.message);
//     }
//   }
// );


export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post('/api/v1/users/login', credentials);
      const { token, user } = response.data;
      // Store the token
      localStorage.setItem('token', token);
      // Set the token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user details
      dispatch(getUserDetails());
      return user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);





// Logout User
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      const response = await axios.post('/api/v1/users/logout');
      return response.data;
    } catch (error) {
      // Catch and handle any errors
      console.error('Logout failed:', error);
      return rejectWithValue(error.response.data);
    }
  }
);
export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { dispatch }) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Dispatch getUserDetails to fetch user info
      dispatch(getUserDetails());
      return true;
    }
    return false;
  }
);

// Get User Details
export const getUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/users/me', {
        withCredentials: true
      });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'  // Assuming you're sending form data
        }
      };
      const { data } = await axios.put('/api/v1/users/me/update', profileData, config);
      return data.user;  // Assuming the API returns the updated user object
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get All Users (Admin)
export const getAllUsers = createAsyncThunk(
  'user/getAllUsers',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.get('/api/v1/users/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get Single User (Admin)
export const getSingleUser = createAsyncThunk(
  'user/getSingleUser',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.get(`/api/v1/users/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Update User Role (Admin)
export const updateUserRole = createAsyncThunk(
  'user/updateUserRole',
  async ({ id, role }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      const { data } = await axios.put(`/api/v1/users/admin/user/${id}`, { role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Delete User (Admin)
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      await axios.delete(`/api/v1/users/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Clear Errors
export const clearErrors = createAction('user/clearErrors');

// Clear Messages
export const clearMessages = createAction('user/clearMessages');
