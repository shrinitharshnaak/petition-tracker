import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // clear token on reload
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === allowedRole) {
      setIsAuthorized(true);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  }, [allowedRole]);

  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
