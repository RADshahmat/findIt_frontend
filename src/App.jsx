import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { loadUserFromToken } from "./features/auth/authSlice"
import { ThemeProvider } from "./contexts/ThemeContext"
import Homepage from "./pages/homepage"
import DashboardPage from "./pages/dashboardPage"
import ScrollRestoration from "./components/ScrollToTop"
import UserPage from "./pages/userAreaPage"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./ProtectedRoute"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUserFromToken())
  }, [dispatch])

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <BrowserRouter>
          <ScrollRestoration />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* User area routes with nested paths */}
            <Route
              path="/user/*"
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  )
}

export default App
