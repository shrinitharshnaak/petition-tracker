import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

// CITIZEN
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenProfile from "./pages/CitizenProfile";
import CreatePetition from "./pages/CreatePetition";
import MyPetitions from "./pages/MyPetitions";
import ViewPetition from "./pages/ViewPetition";

// PARTY (stubs, will build later)
import RulingDashboard from "./pages/RulingDashboard";
import NonRulingDashboard from "./pages/NonRulingDashboard";

// ADMIN (stub)
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CITIZEN ROUTES */}
        <Route
          path="/citizen/dashboard"
          element={token && role === "citizen" ? <CitizenDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/citizen/profile"
          element={token && role === "citizen" ? <CitizenProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/citizen/create"
          element={token && role === "citizen" ? <CreatePetition /> : <Navigate to="/login" />}
        />
        <Route
          path="/citizen/mypetitions"
          element={token && role === "citizen" ? <MyPetitions /> : <Navigate to="/login" />}
        />
        <Route
          path="/citizen/petition/:id"
          element={token && role === "citizen" ? <ViewPetition /> : <Navigate to="/login" />}
        />

        {/* RULING PARTY */}
        <Route
          path="/ruling/dashboard"
          element={token && role === "ruling" ? <RulingDashboard /> : <Navigate to="/login" />}
        />

        {/* NON-RULING PARTY */}
        <Route
          path="/nonruling/dashboard"
          element={token && role === "non-ruling" ? <NonRulingDashboard /> : <Navigate to="/login" />}
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={token && role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<h2 className="text-center mt-10">404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
