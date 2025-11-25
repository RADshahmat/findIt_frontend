// features/people/peopleSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

// ⭐ Thunk: Fetch People category posts
export const fetchPeoplePosts = createAsyncThunk(
    "people/fetchPeoplePosts",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get("posts/people");
            return res.data; // backend returns array
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || "Failed to fetch people posts"
            );
        }
    }
);

const peopleSlice = createSlice({
    name: "people",
    initialState: {
        peopleItems: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPeoplePosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPeoplePosts.fulfilled, (state, action) => {
                state.loading = false;
                state.peopleItems = action.payload;
            })
            .addCase(fetchPeoplePosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default peopleSlice.reducer;
