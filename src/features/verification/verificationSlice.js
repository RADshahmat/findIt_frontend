// features/verification/verificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axios/axiosInstance";

// GET dynamic QnA from backend
export const generateQnA = createAsyncThunk(
  "verification/generateQnA",
  async (postId, { rejectWithValue }) => {
    try {
      console.log("🔹 Calling generateQnA API for:", postId);
      const res = await axiosInstance.get(`/qnagenerate/${postId}`);
      console.log("✅ Response:", res.data);
      // Return both questions and message for frontend
      return { 
        questions: res.data.questions || [], 
        message: res.data.message || "" 
      };
    } catch (err) {
      console.log("❌ Error:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
//submit answers and proof files to backend
export const verifyQnA = createAsyncThunk(
  "verification/verifyQnA",
  async ({ postId, formData }, { rejectWithValue }) => {
    try {
      for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}

      const res = await axiosInstance.post(`/verifyanswer/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


const verificationSlice = createSlice({
  name: "verification",
  initialState: {
    loading: false,
    generatedQuestions: [],
    apiMessage: "",         // message from backend
    submissionResult: null,
    error: null,
  },
  reducers: {
    clearVerificationState: (state) => {
      state.generatedQuestions = [];
      state.apiMessage = "";
      state.submissionResult = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // generateQnA
      .addCase(generateQnA.pending, (state) => {
        state.loading = true;
        state.generatedQuestions = [];
        state.apiMessage = "";
        state.error = null;
      })
.addCase(generateQnA.fulfilled, (state, action) => {
  state.loading = false;
  state.generatedQuestions = action.payload.questions || [];

  // Only show message if it's the "already submitted" case
  if (action.payload.message === "You have already submitted verification for this post.") {
    state.apiMessage = action.payload.message;
  } else {
    state.apiMessage = ""; // don't show message for other cases
  }
})

      .addCase(generateQnA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to generate QnA";
      })
      // verifyQnA
      .addCase(verifyQnA.pending, (state) => {
        state.loading = true;
        state.submissionResult = null;
        state.error = null;
      })
      .addCase(verifyQnA.fulfilled, (state, action) => {
        state.loading = false;
        state.submissionResult = action.payload;
      })
      .addCase(verifyQnA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit answers";
      });
  },
});

export const { clearVerificationState } = verificationSlice.actions;
export default verificationSlice.reducer;
