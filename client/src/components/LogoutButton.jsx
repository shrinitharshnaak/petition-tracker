// src/components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";

export default function LogoutButton({ setSession }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setSession({ token: null, role: null });
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
}
