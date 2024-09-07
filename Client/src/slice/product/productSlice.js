import { createSlice } from '@reduxjs/toolkit';
import { productActions, productCategoryActions, clearErrors, clearMessages } from '../../action/product/productAction';

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
          state[`${entityName}s`].push(action.payload);
          state.message = `${capitalizedName} created successfully`;
        })
        .addCase(actions.create.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.fetchAll.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.fetchAll.fulfilled, (state, action) => {
          state.loading = false;
          state[`${entityName}s`] = action.payload;
          // state.loading = false;
          // state.productCategorys = action.payload;
        })
        .addCase(actions.fetchAll.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.fetchById.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.fetchById.fulfilled, (state, action) => {
          state.loading = false;
          state[entityName] = action.payload;
        })
        .addCase(actions.fetchById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        .addCase(actions.update.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.update.fulfilled, (state, action) => {
          state.loading = false;
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

        .addCase(actions.remove.pending, (state) => {
          state.loading = true;
        })
        .addCase(actions.remove.fulfilled, (state, action) => {
          state.loading = false;
          state[`${entityName}s`] = state[`${entityName}s`].filter(item => item.id !== action.payload);
          state.message = `${capitalizedName} deleted successfully`;
        })
        .addCase(actions.remove.rejected, (state, action) => {
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

export const productSlice = createEntitySlice('product', productActions);
export const productCategorySlice = createEntitySlice('productCategory', productCategoryActions);

export const productReducer = productSlice.reducer;
export const productCategoryReducer = productCategorySlice.reducer;