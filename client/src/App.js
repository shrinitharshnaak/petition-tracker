import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenDashboard from "./pages/CitizenDashboard";
import RulingDashboard from "./pages/RulingDashboard";
import NonRulingDashboard from "./pages/NonRulingDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/citizen-dashboard" element={<CitizenDashboard />} />
      <Route path="/ruling-dashboard" element={<RulingDashboard />} />
      <Route path="/nonruling-dashboard" element={<NonRulingDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
