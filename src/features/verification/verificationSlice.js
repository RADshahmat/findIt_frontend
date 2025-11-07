import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance"

export const generateQnA = createAsyncThunk(
  "verification/generateQnA",
  async (postId, { rejectWithValue }) => {
    try {
      console.log("🔹 Calling generateQnA API for:", postId);
      const res = await axiosInstance.get(`/qnagenerate/${postId}`);
      console.log("✅ Response:", res.data);
      return res.data.questions;
    } catch (err) {
      console.log("❌ Error:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const verifyQnA = createAsyncThunk(
  "verification/verifyQnA",
  async ({ postId, userAnswers }, { rejectWithValue }) => {
    try {
      console.log("🔹 Submitting answers for:", postId, userAnswers);
      const res = await axiosInstance.post(`/verifyanswer/${postId}`, { userAnswers });
      console.log("✅ Verification response:", res.data);
      return res.data;
    } catch (err) {
      console.log("❌ Verification Error:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const verificationSlice = createSlice({
  name: "verification",
  initialState: {
    loading: false,
    generatedQuestions: [],
    submissionResult: null,
    error: null,
  },
  reducers: {
    clearVerificationState: (state) => {
      state.generatedQuestions = [];
      state.submissionResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQnA.pending, (state) => { state.loading = true; })
      .addCase(generateQnA.fulfilled, (state, action) => {
        state.loading = false;
        state.generatedQuestions = action.payload;
      })
      .addCase(generateQnA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyQnA.pending, (state) => { state.loading = true; })
      .addCase(verifyQnA.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionResult = action.payload;
      })
      .addCase(verifyQnA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVerificationState } = verificationSlice.actions;
export default verificationSlice.reducer;
