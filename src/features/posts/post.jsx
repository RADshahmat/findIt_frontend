// features/post/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

export const createPost = createAsyncThunk(
    "post/createPost",
    async (formData, thunkAPI) => {
        try {
            console.log("Creating post with data:");
            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }
            const res = await axiosInstance.post("post", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Post created successfully:", res.data);
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

const postSlice = createSlice({
    name: "post",
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
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.postData = action.payload;
            })
            .addCase(createPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong";
            });
    },
});

export const { resetPostState } = postSlice.actions;
export default postSlice.reducer;
