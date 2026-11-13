import Feedback from "./pages/Feedback";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Customers from "./pages/Customers";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/" element={<Navigate to="/register" replace />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Customer Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/customers" element={<Customers />} />

        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
