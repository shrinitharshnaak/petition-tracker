import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all localStorage data
    localStorage.clear();
    // Redirect to login page
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-lg text-gray-700">Logging out...</p>
    </div>
  );
}
