// src/features/productCategories/productCategorySlice.js

import { createSlice } from '@reduxjs/toolkit';
import { fetchProductCategories, addProductCategory, updateProductCategory } from '../action/productCategoryActions';


const productCategorySlice = createSlice({
  name: 'productCategories',
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
    loading: false, // Add a loading state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductCategories.pending, (state) => {
        state.status = 'loading';
        state.loading = true; // Set loading to true
      })
      .addCase(fetchProductCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload.categories;
        state.loading = false; // Set loading to false
      })
      .addCase(fetchProductCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false; // Set loading to false
      })
      .addCase(addProductCategory.pending, (state) => {
        state.status = 'loading';
        state.loading = true; // Set loading to true
      })
      .addCase(addProductCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories.push(action.payload.data); // Adding the newly created category to the list
        state.loading = false; // Set loading to false
      })
      .addCase(addProductCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false; // Set loading to false
      })
      .addCase(updateProductCategory.pending, (state) => {
        state.status = 'loading';
        state.loading = true; // Set loading to true
      })
      .addCase(updateProductCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload.data; // Updating the category in the list
        }
        state.loading = false; // Set loading to false
      })
      .addCase(updateProductCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false; // Set loading to false
      });
  },
});

export default productCategorySlice.reducer;
