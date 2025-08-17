// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// CITIZEN
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenProfile from "./pages/CitizenProfile";
import CreatePetition from "./pages/CreatePetition";
import MyPetitions from "./pages/MyPetitions";
import ViewPetition from "./pages/ViewPetition";

// PARTY
import RulingDashboard from "./pages/RulingDashboard";
import NonRulingDashboard from "./pages/NonRulingDashboard";

// ADMIN
import AdminDashboard from "./pages/AdminDashboard";

// ProtectedRoute
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CITIZEN */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute allowedRole="citizen">
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/profile"
          element={
            <ProtectedRoute allowedRole="citizen">
              <CitizenProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/create"
          element={
            <ProtectedRoute allowedRole="citizen">
              <CreatePetition />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/mypetitions"
          element={
            <ProtectedRoute allowedRole="citizen">
              <MyPetitions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/petition/:id"
          element={
            <ProtectedRoute allowedRole="citizen">
              <ViewPetition />
            </ProtectedRoute>
          }
        />

        {/* RULING PARTY */}
        <Route
          path="/ruling/dashboard"
          element={
            <ProtectedRoute allowedRole="rulingparty">
              <RulingDashboard />
            </ProtectedRoute>
          }
        />

        {/* NON-RULING PARTY */}
        <Route
          path="/nonruling/dashboard"
          element={
            <ProtectedRoute allowedRole="nonrulingparty">
              <NonRulingDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<h2 className="text-center mt-10">404 - Page Not Found</h2>}
        />
      </Routes>
    </Router>
  );
}

export default App;
