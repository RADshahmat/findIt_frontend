import { configureStore } from '@reduxjs/toolkit';
import catagoryReducer from '../features/catagory/catagory.jsx';
import authReducer from '../features/auth/authSlice.jsx';

export const store = configureStore({
  reducer: {
    catagory: catagoryReducer,
    auth: authReducer,
  },
});
