import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axios/axiosInstance';

// Async thunk to fetch Catagories
export const fetchCatagories = createAsyncThunk(
  'catagory/fetchCatagories',
  async () => {
    const response = await axiosInstance.get('/category');
    return response.data;
  }
);

const catagorySlice = createSlice({
  name: 'catagory',
  initialState: {
    catagory: [],
    status: 'idle',
    error: null,
  },
  reducers: {}, // no sync reducers needed now
  extraReducers: builder => {
    builder
      .addCase(fetchCatagories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCatagories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.catagory = action.payload;
      })
      .addCase(fetchCatagories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default catagorySlice.reducer;
