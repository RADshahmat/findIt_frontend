import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

export const postActivenessFlag = createAsyncThunk(
  "post/postActivenessFlag",
  async ({ postId, myListingId }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(
        "post/postactivenessflag",
        { postId, myListingId }
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to update activeness flag");
    }
  }
);

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const postActivenessFlagSlice = createSlice({
  name: "postActivenessFlag",
  initialState,
  reducers: {
    resetPostActivenessFlagState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postActivenessFlag.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(postActivenessFlag.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(postActivenessFlag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  }
});

export const { resetPostActivenessFlagState } =
  postActivenessFlagSlice.actions;

export default postActivenessFlagSlice.reducer;
