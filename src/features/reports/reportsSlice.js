import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../axios/axiosInstance"

// Demo data
export const demoReports = [
  {
    id: "6866850a17f1183a2ea9f7a2",
    title: "Person",
    description: "Lost person in Patuakhali area. Please help us find them.",
    category: "People",
    subcategory: "Man",
    location: "Patuakhali",
    date: "2025-07-03T00:00:00.000Z",
    status: "lost",
    image: "http://93.127.166.229:5000/image/1obRQVFL-j3iXZKeAfOrGU_6WW9rdcJ5F",
    postedBy: "Rad",
    views: 0,
    reward: 9999993,
    contactName: "Rad Ahmed",
    contactPhone: "+880 1234 567890",
    contactEmail: "rad@example.com",
    urgency: "critical",
    createdAt: "2025-07-03T00:00:00.000Z",
  },
  {
    id: "6866850a17f1183a2ea9f7a3",
    title: "iPhone 13 Pro",
    description: "Found iPhone 13 Pro near Dhaka University campus. Screen is cracked but phone is working.",
    category: "Electronics",
    subcategory: "Phone",
    location: "Dhaka University",
    date: "2025-07-02T00:00:00.000Z",
    status: "found",
    image: "/placeholder.svg?height=128&width=192",
    postedBy: "Sarah",
    views: 15,
    contactName: "Sarah Khan",
    contactPhone: "+880 1987 654321",
    contactEmail: "sarah@example.com",
    condition: "fair",
    createdAt: "2025-07-02T00:00:00.000Z",
  },
  {
    id: "6866850a17f1183a2ea9f7a4",
    title: "Black Wallet",
    description: "Lost my black leather wallet containing important documents and cards.",
    category: "Accessories",
    subcategory: "Wallet",
    location: "Gulshan 2",
    date: "2025-07-01T00:00:00.000Z",
    status: "lost",
    image: "/placeholder.svg?height=128&width=192",
    postedBy: "John",
    views: 8,
    reward: 5000,
    contactName: "John Doe",
    contactPhone: "+880 1555 123456",
    contactEmail: "john@example.com",
    urgency: "high",
    createdAt: "2025-07-01T00:00:00.000Z",
  },
]


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
// Async thunks
export const fetchUserReports1 = createAsyncThunk("reports/fetchUserReports", async (_, { rejectWithValue }) => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return demoReports
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

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
    await new Promise((resolve) => setTimeout(resolve, 800))
    return reportId
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    userReports: [],
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
