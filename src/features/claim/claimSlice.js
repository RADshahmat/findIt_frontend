// features/claims/claimsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

// FETCH all claims for a found post
export const fetchClaimsByFoundPost = createAsyncThunk(
  "claims/fetchClaims",
  async (foundPostId, { rejectWithValue }) => {
    try {
      console.log("🔹 Fetching claims for foundPostId:", foundPostId);

      const res = await axiosInstance.get(`/claims/${foundPostId}`);

      console.log("✅ Claims response:", res.data);

      return res.data; // Array of claims
    } catch (err) {
      console.error("❌ Error:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const claimsSlice = createSlice({
  name: "claims",
  initialState: {
    claims: [],
    loading: false,
    error: null,
  },

  reducers: {
  approveClaim: (state, action) => {
    const id = action.payload;
    state.claims = state.claims.map(c =>
      c._id === id ? { ...c, status: "approved" } : c
    );
  },

  rejectClaim: (state, action) => {
    const id = action.payload;
    state.claims = state.claims.map(c =>
      c._id === id ? { ...c, status: "rejected" } : c
    );
  }
},

  extraReducers: (builder) => {
    builder
      .addCase(fetchClaimsByFoundPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchClaimsByFoundPost.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload; // array from backend
      })

      .addCase(fetchClaimsByFoundPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch claims";
      });
  },
});

export const { approveClaim, rejectClaim } = claimsSlice.actions;
export default claimsSlice.reducer;
