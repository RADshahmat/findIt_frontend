import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axios/axiosInstance';

// Async thunk to fetch Catagories
export const fetchMatchess = createAsyncThunk(
  'matches/fetchMatchess',
  async (id) => {
    const response = await axiosInstance.get(`/matching/${id}`);
    return response.data;
  }
);

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
    matches: [],
    loading: 'idle',
    error: null,
  },
  reducers: {}, // no sync reducers needed now
  extraReducers: builder => {
    builder
      .addCase(fetchMatchess.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchMatchess.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.matches = action.payload.filteredPosts;
      })
      .addCase(fetchMatchess.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message;
      });
  },
});

export default matchesSlice.reducer;
