// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🚨 If no token, send back to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🚨 If role not allowed, block access
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Show the page
  return children;
}
