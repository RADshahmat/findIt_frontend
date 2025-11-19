import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

export const fetchMatchedLostPost = createAsyncThunk(
  "matchedLostPost/fetch",
  async (matchedPostId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/post/${matchedPostId}`);
      return res.data.lostPost;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const matchedLostPostSlice = createSlice({
  name: "matchedLostPost",
  initialState: {
    post: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearMatchedLostPost: (state) => {
      state.post = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatchedLostPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchedLostPost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(fetchMatchedLostPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMatchedLostPost } = matchedLostPostSlice.actions;
export default matchedLostPostSlice.reducer;
