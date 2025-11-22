import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../axios/axiosInstance"



export const fetchUserReports = createAsyncThunk("reports/fetchUserReports", async (_, { rejectWithValue }) => {
  console.log("Fetching user reports...")
  try {
    const res = await axiosInstance.get("own_posts");
    console.log("Post get successfully:", res.data);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.message)
  }
}
);

export const fetchArchivedReports = createAsyncThunk(
  "reports/fetchArchivedReports",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/own_archived_posts");
      console.log("archived Post get successfully:", res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const createReport = createAsyncThunk("reports/createReport", async (reportData, { rejectWithValue }) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const newReport = {
      ...reportData,
      id: Date.now().toString(),
      views: 0,
      createdAt: new Date().toISOString(),
      postedBy: "Current User",
    }
    return newReport
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const updateReport = createAsyncThunk(
  "reports/updateReport",
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return { id, ...updateData }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const deleteReport = createAsyncThunk("reports/deleteReport", async (reportId, { rejectWithValue }) => {
  try {
    // Simulate API call
    console.log("Deleting report with ID:", reportId)
    const res = await axiosInstance.delete("post", {
      data: { reportId }
    });

    return res.data
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    userReports: [],
    archivedReports: [],
    loading: false,
    error: null,
    searchTerm: "",
    filterType: "all",
    sortBy: "newest",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user reports
      .addCase(fetchUserReports.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserReports.fulfilled, (state, action) => {
        state.loading = false
        state.userReports = action.payload
      })
      .addCase(fetchUserReports.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch archived reports
      .addCase(fetchArchivedReports.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchArchivedReports.fulfilled, (state, action) => { state.loading = false; state.archivedReports = action.payload })
      .addCase(fetchArchivedReports.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      // Create report
      .addCase(createReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false
        state.userReports.unshift(action.payload)
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update report
      .addCase(updateReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading = false
        const index = state.userReports.findIndex((report) => report.id === action.payload.id)
        if (index !== -1) {
          state.userReports[index] = { ...state.userReports[index], ...action.payload }
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete report
      .addCase(deleteReport.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false
        state.userReports = state.userReports.filter((report) => report.id !== action.payload)
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSearchTerm, setFilterType, setSortBy, clearError } = reportsSlice.actions
export default reportsSlice.reducer
