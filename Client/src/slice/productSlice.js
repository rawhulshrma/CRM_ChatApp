import { createSlice } from '@reduxjs/toolkit';
import { addProduct, fetchProducts } from '../action/productAction';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.product);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default productSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';
// import { addProduct,
//     getAllProducts,
//     //   checkAuth,
// //   loginUser,
// //   getUserDetails,
// //   updateProfile,
// //   getAllUsers,
// //   getSingleUser,
// //   updateUserRole,
// //   deleteUser
//  } from '../action/productAction';

// const productSlice = createSlice({
//   name: 'product',
//   initialState: {
//     products: [],
//     loading: false,
//     error: null,
//     message: null,
//   },
//   reducers: {
//     clearErrors: (state) => {
//       state.error = null;
//     },
//     clearMessages: (state) => {
//       state.message = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(addProduct.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(addProduct.fulfilled, (state, action) => {
//         state.loading = false;
//         state.products.push(action.payload);
//         state.message = 'Product added successfully';
//       })
//       .addCase(addProduct.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(getAllProducts.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getAllProducts.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//         state.error = null;
//       })
//       .addCase(getAllProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//     //   .addCase(updateProfile.pending, (state) => {
//     //     state.loading = true;
//     //   })
//     //   .addCase(updateProfile.fulfilled, (state, action) => {
//     //     state.loading = false;
//     //     state.user = action.payload;
//     //     state.updateSuccess = true;
//     //   })
//     //   .addCase(updateProfile.rejected, (state, action) => {
//     //     state.loading = false;
//     //     state.error = action.payload;
//     //   })
//     //   .addCase(getAllUsers.pending, (state) => {
//     //     state.loading = true;
//     //   })
//     //   .addCase(getAllUsers.fulfilled, (state, action) => {
//     //     state.loading = false;
//     //     state.users = action.payload;
//     //   })
//     //   .addCase(getAllUsers.rejected, (state, action) => {
//     //     state.loading = false;
//     //     state.error = action.payload;
//     //   })
//     //   .addCase(getSingleUser.pending, (state) => {
//     //     state.loading = true;
//     //   })
//     //   .addCase(getSingleUser.fulfilled, (state, action) => {
//     //     state.loading = false;
//     //     state.user = action.payload;
//     //   })
//     //   .addCase(getSingleUser.rejected, (state, action) => {
//     //     state.loading = false;
//     //     state.error = action.payload;
//     //   })
//     //   .addCase(updateUserRole.pending, (state) => {
//     //     state.loading = true;
//     //   })
//     //   .addCase(updateUserRole.fulfilled, (state, action) => {
//     //     state.loading = false;
//     //     state.user = action.payload;
//     //   })
//     //   .addCase(updateUserRole.rejected, (state, action) => {
//     //     state.loading = false;
//     //     state.error = action.payload;
//     //   })
//     //   .addCase(deleteUser.pending, (state) => {
//     //     state.loading = true;
//     //   })
//     //   .addCase(deleteUser.fulfilled, (state, action) => {
//     //     state.loading = false;
//     //     state.users = state.users.filter((user) => user._id !== action.payload);
//     //   })
//     //   .addCase(deleteUser.rejected, (state, action) => {
//     //     state.loading = false;
//     //     state.error = action.payload;
//     //   });
//   },
// });

// export const { clearErrors, clearMessages } = productSlice.actions;
// export default productSlice.reducer;