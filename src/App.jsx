import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage";
import DashboardPage from "./pages/dashboardPage"
import ScrollRestoration from "./components/ScrollToTop";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollRestoration />
        <Routes>
          <Route path="/" element={<Homepage />} /> 
          <Route path="/home" element={<Homepage />} /> 
          <Route path="/dashboard" element={<DashboardPage />} /> 
          <Route path="/login" element={<LoginPage />} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
