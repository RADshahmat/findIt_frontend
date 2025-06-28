import { configureStore } from '@reduxjs/toolkit';
import catagoryReducer from '../features/catagory/catagory.jsx';
import authReducer from '../features/auth/authSlice.jsx';
import postReducer from '../features/posts/post.jsx';
import locationReducer from '../features/location/location.jsx';
import fetchPostReducer  from '../features/posts/fetchPost.jsx';

export const store = configureStore({
  reducer: {
    catagory: catagoryReducer,
    auth: authReducer,
    post: postReducer,
    location: locationReducer,
    fetchPost: fetchPostReducer,
  },
});
