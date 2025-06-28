import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axios/axiosInstance';

// Async thunk to fetch Catagories
export const fetchLocations = createAsyncThunk(
  'location/fetchLocations',
  async () => {
    const response = await axiosInstance.get('/locCount');
    return response.data;
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    location: [],
    status1: 'idle',
    error: null,
  },
  reducers: {}, // no sync reducers needed now
  extraReducers: builder => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status1 = 'loading';
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status1 = 'succeeded';
        state.location = action.payload;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status1 = 'failed';
        state.error = action.error.message;
      });
  },
});

export default locationSlice.reducer;
