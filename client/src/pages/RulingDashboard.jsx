import React, { useState, useEffect } from "react";
import axios from "axios";

export default function RulingDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [petitions, setPetitions] = useState([]);
  const [stats, setStats] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [reputation, setReputation] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dashboard stats
        const statsRes = await axios.get("http://localhost:5000/api/petitions/stats/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(statsRes.data || {});

        // Leaderboard
        const leaderboardRes = await axios.get("http://localhost:5000/api/petitions/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaderboard(leaderboardRes.data || []);

        // Fetch petitions escalated to this ruling party
        const petitionsRes = await axios.get("http://localhost:5000/api/petitions/escalated", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPetitions(petitionsRes.data || []);

        // Fetch own profile to get reputation score
        const profileRes = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReputation(profileRes.data.reputation || 0);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/petitions/ruling/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPetitions(petitions.map(p => (p._id === id ? res.data.petition : p)));
      alert("Petition updated successfully!");
    } catch (err) {
      console.error("Failed to update petition status:", err);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-green-400">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-green-400 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Ruling Party Dashboard</h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          {["dashboard", "petitions", "profile"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab === "dashboard" && "📊 Dashboard"}
              {tab === "petitions" && "🗂 Escalated Petitions"}
              {tab === "profile" && "👤 My Profile"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-blue-700">Total Petitions</h3>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-green-700">Active Petitions</h3>
                <p className="text-2xl font-bold">{stats.active || 0}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-purple-700">Solved Petitions</h3>
                <p className="text-2xl font-bold">{stats.solved || 0}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-yellow-700">My Reputation</h3>
                <p className="text-2xl font-bold">{reputation}</p>
              </div>
            </div>

            {/* Leaderboard */}
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Party Leaderboard</h3>
            <table className="w-full border-collapse border border-gray-300 shadow rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-200 text-left">
                  <th className="p-2 border border-gray-300">Party Name</th>
                  <th className="p-2 border border-gray-300">Reputation</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((party, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="p-2 border border-gray-300">{party.name}</td>
                    <td className="p-2 border border-gray-300">{party.reputationScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "petitions" && (
          <div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Escalated Petitions</h3>
            {petitions.length === 0 ? (
              <p className="text-gray-600">No escalated petitions at the moment.</p>
            ) : (
              <ul className="space-y-4">
                {petitions.map(p => (
                  <li key={p._id} className="border p-4 rounded-lg shadow hover:shadow-md transition">
                    <h4 className="font-semibold text-lg">{p.title}</h4>
                    <p>{p.description}</p>
                    <p className="text-sm text-gray-500">Status: {p.status}</p>
                    <div className="mt-2 space-x-2">
                      {p.status !== "Resolved" && (
                        <button
                          onClick={() => updateStatus(p._id, "Resolved")}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Solve
                        </button>
                      )}
                      {p.status !== "Closed" && (
                        <button
                          onClick={() => updateStatus(p._id, "Closed")}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4">My Profile</h3>
            <p><b>Name:</b> Ruling Party Name</p>
            <p><b>Email:</b> ruling@example.com</p>
            <p><b>Role:</b> Ruling Party</p>
            <p><b>Reputation Score:</b> {reputation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
