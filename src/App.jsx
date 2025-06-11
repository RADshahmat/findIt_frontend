import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage";
import DashboardPage from "./pages/dashboardPage"
import ScrollRestoration from "./components/ScrollToTop";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollRestoration />
        <Routes>
          <Route path="/" element={<Homepage />} /> 
          <Route path="/home" element={<Homepage />} /> 
          <Route path="/dashboard" element={<DashboardPage />} /> 
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
