// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboards
import CitizenDashboard from "./pages/CitizenDashboard";
import RulingDashboard from "./pages/RulingDashboard";
import NonRulingDashboard from "./pages/NonRulingDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// ProtectedRoute Component
function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && (!allowedRole || role === allowedRole)) {
      setIsAuthorized(true);
    }
    setLoading(false);
  }, [allowedRole]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return isAuthorized ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Citizen Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />

        {/* Ruling Party Dashboard */}
        <Route
          path="/ruling/dashboard"
          element={
            <ProtectedRoute allowedRole="rulingparty">
              <RulingDashboard />
            </ProtectedRoute>
          }
        />

        {/* Non-Ruling Party Dashboard */}
        <Route
          path="/nonruling/dashboard"
          element={
            <ProtectedRoute allowedRole="nonrulingparty">
              <NonRulingDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={<h2 className="text-center mt-10">404 - Page Not Found</h2>}
        />
      </Routes>
    </Router>
  );
}

export default App;
