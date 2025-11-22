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

export const createMyListingLostPost = createAsyncThunk(
    "post/createMyListingLostPost",
    async ({ id, formData }, thunkAPI) => {
        try {
            //console.log("Creating MyListing Lost Post:", id);
//console.log("Form Data: ",formData);
            const res = await axiosInstance.post(
                `createmylistinglostpost/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    transformRequest: (data) => data, // ✅ prevents Axios from changing FormData
                }
            );

            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || "Failed to post mylisting lost"
            );
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
            })
        
     .addCase(createMyListingLostPost.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
    })
    .addCase(createMyListingLostPost.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.postData = action.payload;
    })
    .addCase(createMyListingLostPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
    });},
});

export const { resetPostState } = postSlice.actions;
export default postSlice.reducer;
