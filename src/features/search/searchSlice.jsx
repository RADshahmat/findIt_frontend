// features/search/searchSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

export const searchByQueryAndImage = createAsyncThunk(
  "search/queryWithImage",
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/search", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data,"search data")
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchByQueryAndImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchByQueryAndImage.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchByQueryAndImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchSlice.reducer;
