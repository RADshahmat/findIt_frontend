import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";
import { toast } from "react-toastify";

export const submitReportToAdmin = createAsyncThunk(
  "report/submitReportToAdmin",
  async ({ reportText, reportImages, listingId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("report_body", reportText);
      formData.append("post_id", listingId);

      // append images[]
      reportImages.forEach((img) => {
        formData.append("report_images", img);
      });

      const res = await axiosInstance.post("/admin/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Report submitted successfully!");
      return res.data;
    } catch (error) {
      toast.error("Failed to submit report");
      return rejectWithValue(error.message);
    }
  }
);

const reporttoadminSlice = createSlice({
  name: "reporttoadmin",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(submitReportToAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitReportToAdmin.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitReportToAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reporttoadminSlice.reducer;
