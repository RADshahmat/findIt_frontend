// features/claims/claimsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { toast } from "react-toastify";

// FETCH all claims for a found post
export const fetchClaimsByFoundPost = createAsyncThunk(
  "claims/fetchClaims",
  async (foundPostId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/claims/${foundPostId}`);
      //console.log(res.data);
      return res.data;
      
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// APPROVE Claim (API call)
export const approveClaimThunk = createAsyncThunk(
  "claims/approveClaim",
  async (claimId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/claims/approve/${claimId}`);
      toast.success("Claim approved successfully!");
      return res.data; // updated claim returned from backend
    } catch (err) {
      toast.error("Failed to approve claim");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// REJECT Claim (API call)
export const rejectClaimThunk = createAsyncThunk(
  "claims/rejectClaim",
  async (claimId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/claims/reject/${claimId}`);
      toast.success("Claim rejected successfully!");
      return res.data;
    } catch (err) {
      toast.error("Failed to reject claim");
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

  reducers: {},

  extraReducers: (builder) => {
    builder
      // ------------------------
      // FETCH ALL CLAIMS
      // ------------------------
      .addCase(fetchClaimsByFoundPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaimsByFoundPost.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload.claims;
      })
      .addCase(fetchClaimsByFoundPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch claims";
      })

      // ------------------------
      // APPROVE CLAIM
      // ------------------------
.addCase(approveClaimThunk.fulfilled, (state, action) => {
  state.claims = state.claims.map(c =>
    c._id === action.payload.claims._id ? { ...c, ...action.payload.claims } : c
  );
})
.addCase(rejectClaimThunk.fulfilled, (state, action) => {
  state.claims = state.claims.map(c =>
    c._id === action.payload.claims._id ? { ...c, ...action.payload.claims} : c
  );
});

  },
});

export default claimsSlice.reducer;
