import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === allowedRole) {
      setIsAuthorized(true);
    }
    setLoading(false);
  }, [allowedRole]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-700 text-lg">Checking authorization...</div>
      </div>
    );
  }

  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
