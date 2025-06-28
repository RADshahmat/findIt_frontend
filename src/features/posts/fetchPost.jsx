// features/post/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

export const fetchPost = createAsyncThunk(
  "post/fetchPost",
  async (param, thunkAPI) => {
    console.log("Fetching post with params:", param);
    try {
      const res = await axiosInstance.get("post", {
        params: param,
      });
      console.log("Post get successfully:", res.data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to post");
    }
  }
);


const initialState = {
    loading: false,
    success: false,
    error: null,
    postData: null,
};

const fetchPostSlice = createSlice({
    name: "fetchPost",
    initialState,
    reducers: {
        resetPostState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.postData = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPost.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(fetchPost.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.postData = action.payload;
            })
            .addCase(fetchPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export const { resetPostState } = fetchPostSlice.actions;
export default fetchPostSlice.reducer;
