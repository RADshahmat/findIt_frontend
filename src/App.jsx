import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUserFromToken, setFcmToken } from "./features/auth/authSlice";
import { ThemeProvider } from "./contexts/ThemeContext";
import Homepage from "./pages/homepage";
import DashboardPage from "./pages/dashboardPage";
import ScrollRestoration from "./helpers/scrolltotop";
import UserPage from "./pages/userAreaPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./helpers/ProtectedRoute";
import Messenger from "./components/userpanel/Messenger";
import { requestWebNotificationPermission } from "./helpers/firebaseNotification";
import axiosInstance from "./axios/axiosInstance";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());

    // Mobile FCM from Flutter
    window.setFcmToken = async (token) => {
      console.log("FCM token received from Flutter:", token);
      dispatch(setFcmToken(token));

      try {
        await axiosInstance.post("/save_fcm_token", { fcmToken: token });
        console.log("FCM token sent to backend successfully");
      } catch (err) {
        console.error("Error sending FCM token:", err.response || err);
      }
    };

    // Web FCM
    requestWebNotificationPermission(dispatch, setFcmToken);
  }, [dispatch]);

  return (
    <ThemeProvider>
       <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <BrowserRouter>
          <ScrollRestoration />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/user/*" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
            
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
