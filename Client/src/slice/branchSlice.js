import { createSlice } from '@reduxjs/toolkit';
import {
  createBranch,
  getAllBranch,
  getBranchById,
  updateBranch,
  deleteBranch,
  clearErrors,
  clearMessages
} from '../action/branch/branchAction';

const initialState = {
  branches: [],
  currentBranch: null,
  loading: false,
  error: null,
  message: null,
};

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Branch
      .addCase(createBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches.push(action.payload);
        state.message = 'Branch created successfully';
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Branches
      .addCase(getAllBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = action.payload;
      })
      .addCase(getAllBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An unexpected error occurred';
        console.error('Error in getAllBranch reducer:', action.error);
      })

      // Get Branch By Id
      .addCase(getBranchById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBranchById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBranch = action.payload;
      })
      .addCase(getBranchById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Branch
      .addCase(updateBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.branches.findIndex(branch => branch._id === action.payload._id);
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
        state.message = 'Branch updated successfully';
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Branch
      .addCase(deleteBranch.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.loading = false;
        state.branches = state.branches.filter(branch => branch._id !== action.payload);
        state.message = 'Branch deleted successfully';
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Errors//
      .addCase(clearErrors, (state) => {
        state.error = null;
      })

      // Clear Messages
      .addCase(clearMessages, (state) => {
        state.message = null;
      });
  }
});

export default branchSlice.reducer;