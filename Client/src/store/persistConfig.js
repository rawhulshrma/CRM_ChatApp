// src/persistConfig.js
import storage from 'redux-persist/lib/storage';

export const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'owner',
    'auth',
    'product',
    'productCategory',
    'companies',
    'people',
    'tax',
    'currency',
    'customer',
    'admin',
    'employee',
    'branch',
    'invoice',  // Added 'invoice'
    'customization'
  ],
};
