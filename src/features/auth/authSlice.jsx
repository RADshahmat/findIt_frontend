import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../axios/axiosInstance"


// SIGN UP THUNK
export const registerUser = createAsyncThunk("auth/registerUser", async (formData, thunkAPI) => {
    try {
        const res = await axiosInstance.post("user", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return res.data
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
    }
})

// SIGN IN THUNK
export const loginUser = createAsyncThunk("auth/loginUser", async ({ email, password }, thunkAPI) => {
    try {
        const res = await axiosInstance.post("login", { email, password })
        return res.data
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || { error: "Login failed" })
    }
})

export const loadUserFromToken = createAsyncThunk("auth/loadUserFromToken", async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem("lafuser_token")
        if (!token) throw new Error("No token found")

        const res = await axiosInstance.get("/me")
        //console.log("loadUserFromToken response:", res.data)
        return { user: res.data.user }
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data || { error: "Failed to load user" })
    }
})


const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        userAdded: false, // For signup
        loading: false,     // For signup
        isLoading: false,   // For signin
        loaded: false,     // For loading user from token
        error: null,
        mode: "signin",     // 'signin' or 'signup'
        formData: {
            email: "",
            password: "",
        },
    },
    reducers: {
        setMode: (state, action) => {
            state.mode = action.payload
            state.error = null
        },
        updateForm: (state, action) => {
            state.formData = { ...state.formData, ...action.payload }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        resetAuth: (state) => {
            state.user = null
            state.error = null
            state.formData = { email: "", password: "" }
        },
        logout: (state) => {
            state.user = null;
            state.userAdded = false;
            state.loading = false;
            state.isLoading = false;
            state.error = null;
            state.formData = { email: "", password: "" };
            localStorage.removeItem("lafuser_token");
        },
    },
    extraReducers: (builder) => {
        // Signup handlers
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false
                state.userAdded = action.payload
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

        // Signin handlers
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
                if (action.payload?.user?.token) {
                    localStorage.setItem("lafuser_token", action.payload.user.token)
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
        builder
            .addCase(loadUserFromToken.pending, (state) => {
                state.loaded = false
            })
            .addCase(loadUserFromToken.fulfilled, (state, action) => {
                state.user = action.payload
                state.loaded = true
            })
            .addCase(loadUserFromToken.rejected, (state) => {
                state.user = null
                state.loaded = true
            })
    },
})

export const { setMode, updateForm, setLoading, resetAuth ,logout} = authSlice.actions
export default authSlice.reducer
