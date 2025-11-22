// features/claims/claimsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { toast } from "react-toastify";

export const fetchMyClaims = createAsyncThunk(
  "claims/fetchMyClaims",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/myclaims");
      console.log("Claims get successfully:", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteClaim = createAsyncThunk(
  "claims/deleteClaim",
  async (claimId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/claims/delete/${claimId}`);

      return res.data;  // return success message or deleted item id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
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
    myClaims: [],
    loading: false,
    error: null,
  },

  reducers: {
        resetDeleteClaimState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.myClaims = action.payload; 
      })
      .addCase(fetchMyClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
          c._id === action.payload.claims._id ? { ...c, ...action.payload.claims } : c
        );
      })
    // delete claim
     .addCase(deleteClaim.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(deleteClaim.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default claimsSlice.reducer;
