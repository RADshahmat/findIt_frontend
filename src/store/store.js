import { configureStore } from '@reduxjs/toolkit';
import catagoryReducer from '../features/catagory/catagory.jsx';

export const store = configureStore({
  reducer: {
    catagory: catagoryReducer,
  },
});
