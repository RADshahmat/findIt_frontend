import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

// Fetch My Listings
export const fetchMyListings = createAsyncThunk(
  "myListings/fetchMyListings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/my_listings");
      return res.data.listings; // array of user's listings
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch listings");
    }
  }
);

// Create My Listing
export const createMyListing = createAsyncThunk(
  "myListings/createMyListing",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/my_listings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.listing; // return new listing
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create listing");
    }
  }
);

// Edit My Listing
export const editMyListing = createAsyncThunk(
  "myListings/editMyListing",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/my_listings/${id}`, data);
      return res.data.listing; // updated listing
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to edit listing");
    }
  }
);

// Delete My Listing
export const deleteMyListing = createAsyncThunk(
  "myListings/deleteMyListing",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/my_listings/${id}`);
      return id; // return deleted ID
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete listing");
    }
  }
);


const initialState = {
  loading: false,
  success: false,
  error: null,
  listings: [], // frontend list
};

const myListingsSlice = createSlice({
  name: "myListings",
  initialState,
  reducers: {
    resetMyListingsState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createMyListing.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(createMyListing.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.listings.unshift(action.payload);
      })
      .addCase(createMyListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // FETCH
      .addCase(fetchMyListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch listings";
      })
      .addCase(editMyListing.fulfilled, (state, action) => {
        state.listings = state.listings.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(deleteMyListing.fulfilled, (state, action) => {
        state.listings = state.listings.filter((item) => item._id !== action.payload);
      });


  },
});

export const { resetMyListingsState } = myListingsSlice.actions;
export default myListingsSlice.reducer;


