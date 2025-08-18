// src/pages/CitizenDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ id: null, name: "", state: "", role: "citizen" });

  const [petitions, setPetitions] = useState([]);
  const [myPetitions, setMyPetitions] = useState([]);
  const [stats, setStats] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);

  const config = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  // Decode token to get user info
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({ id: payload.id, name: payload.name, state: payload.state, role: payload.role });
    } catch (err) {
      console.error("Invalid token", err);
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  // Fetch petitions, stats, leaderboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petitionsRes, myPetitionsRes, statsRes, leaderboardRes] = await Promise.all([
          axios.get("http://localhost:5000/api/petitions", config),
          axios.get(`http://localhost:5000/api/petitions/citizen/${user.id}`, config),
          axios.get("http://localhost:5000/api/stats", config),
          axios.get("http://localhost:5000/api/leaderboard", config),
        ]);
        setPetitions(petitionsRes.data || []);
        setMyPetitions(myPetitionsRes.data || []);
        setStats(statsRes.data || {});
        setLeaderboard(leaderboardRes.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.id) fetchData();
  }, [user.id, config]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleCreatePetition = async (e) => {
    e.preventDefault();
    const form = e.target;

    const newPetition = {
      title: form.title.value,
      description: form.description.value,
      state: user.state || "Unknown",
      creator: user.id,
    };

    try {
      const res = await axios.post("http://localhost:5000/api/petitions", newPetition, config);
      setPetitions([res.data, ...petitions]);
      setMyPetitions([res.data, ...myPetitions]);
      form.reset();
      alert("Petition created successfully!");
    } catch (err) {
      console.error("Error creating petition:", err);
      alert("Failed to create petition");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-600">Citizen Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          {["dashboard", "create", "myPetitions", "browse", "profile"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "dashboard" && "📊 Dashboard"}
              {tab === "create" && "✍️ Create Petition"}
              {tab === "myPetitions" && "🗂️ My Petitions"}
              {tab === "browse" && "🌍 Browse Petitions"}
              {tab === "profile" && "👤 My Profile"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-green-700">Total Petitions</h3>
                <p className="text-2xl font-bold">{stats.totalPetitions || 0}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-blue-700">Solved Petitions</h3>
                <p className="text-2xl font-bold">{stats.solvedPetitions || 0}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-purple-700">Welfare Index</h3>
                <p className="text-2xl font-bold">{stats.welfareIndex || "N/A"}</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-green-600 mb-4">Leaderboard</h3>
            <table className="w-full border-collapse border border-gray-300 shadow rounded-lg overflow-hidden mb-8">
              <thead>
                <tr className="bg-green-200 text-left">
                  <th className="p-2 border border-gray-300">Name</th>
                  <th className="p-2 border border-gray-300">Role</th>
                  <th className="p-2 border border-gray-300">Solved Petitions</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((u, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="p-2 border border-gray-300">{u.name}</td>
                    <td className="p-2 border border-gray-300 capitalize">{u.role}</td>
                    <td className="p-2 border border-gray-300">{u.solvedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "create" && (
          <form onSubmit={handleCreatePetition} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Petition Title"
              className="w-full p-3 border rounded-lg"
              required
            />
            <textarea
              name="description"
              placeholder="Petition Description"
              className="w-full p-3 border rounded-lg"
              rows="4"
              required
            />
            <input
              type="text"
              name="state"
              value={user.state || ""}
              readOnly
              className="w-full p-3 border rounded-lg bg-gray-100"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Submit Petition
            </button>
          </form>
        )}

        {activeTab === "myPetitions" && (
          <div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">My Petitions</h3>
            {myPetitions.length === 0 ? (
              <p className="text-gray-600">You haven't submitted any petitions yet.</p>
            ) : (
              <ul className="space-y-4">
                {myPetitions.map((p) => (
                  <li key={p._id} className="border p-4 rounded-lg shadow">
                    <h4 className="font-semibold text-lg">{p.title}</h4>
                    <p>{p.description}</p>
                    <p className="text-sm text-gray-500">Status: {p.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "browse" && (
          <div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">Browse Petitions</h3>
            <ul className="space-y-4">
              {petitions.map((p) => (
                <li key={p._id} className="border p-4 rounded-lg shadow hover:shadow-md transition">
                  <h4 className="font-semibold text-lg">{p.title}</h4>
                  <p>{p.description}</p>
                  <p className="text-sm text-gray-500">Status: {p.status}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">My Profile</h3>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Role:</b> {user.role}</p>
            <p><b>State:</b> {user.state || "N/A"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
