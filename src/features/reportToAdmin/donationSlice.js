import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
//import { toast } from "react-toastify";

export const submitDonationRequest = createAsyncThunk(
  "donations/submitDonationRequest",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/donation/request", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
     // toast.success("Donation request submitted!");
      return data;
    } catch (error) {
     // toast.error("Failed to submit request");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const donationSlice = createSlice({
  name: "donations",
  initialState: { loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(submitDonationRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitDonationRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(submitDonationRequest.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default donationSlice.reducer;
