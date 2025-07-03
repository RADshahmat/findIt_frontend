
import { BrowserRouter, Routes, Route } from "react-router-dom"
import "./App.css"
import { useEffect } from "react"
import { useDispatch, /*useSelector */ } from "react-redux"
import { loadUserFromToken } from "./features/auth/authSlice";
import Homepage from "./pages/homepage";
import DashboardPage from "./pages/dashboardPage"
import ScrollRestoration from "./components/ScrollToTop"
import UserPage from "./pages/userAreaPage"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./ProtectedRoute"

function App() {
  const dispatch = useDispatch();
  //const {user,loaded} = useSelector((state) => state.auth);
 useEffect(() => {
  //console.log("App mounted, loading user from token");
  dispatch(loadUserFromToken());
}, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <ScrollRestoration />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* User area routes with nested paths */}
          <Route path="/user/*"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
