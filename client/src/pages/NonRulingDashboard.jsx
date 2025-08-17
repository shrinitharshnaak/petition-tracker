import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NonRulingDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [petitions, setPetitions] = useState([]);
  const [stats, setStats] = useState({});
  const [reputation, setReputation] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock logged-in non-ruling party info (replace with auth later)
  const state = localStorage.getItem("state");
  const partyId = localStorage.getItem("partyId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // All petitions in state
        const petitionsRes = await axios.get(`http://localhost:5000/api/petitions/state/${state}`);
        setPetitions(petitionsRes.data || []);

        // Stats for petitions
        const statsRes = await axios.get(`http://localhost:5000/api/petitions/stats/state/${state}`);
        setStats(statsRes.data || {});

        // Reputation score
        const partyRes = await axios.get(`http://localhost:5000/api/parties/${partyId}`);
        setReputation(partyRes.data.reputationScore || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state, partyId]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/petitions/status/${id}`, { status: newStatus });
      setPetitions((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: res.data.petition.status } : p))
      );
      if (newStatus === "Resolved") {
        setReputation((prev) => prev + 5);
      }
    } catch (err) {
      console.error("Error updating status:", err);
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
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
          Non-Ruling Party Dashboard
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          {["dashboard", "browse", "profile"].map((tab) => (
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
              {tab === "browse" && "🌍 Browse Petitions"}
              {tab === "profile" && "👤 My Profile"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-green-700">Total Petitions</h3>
                <p className="text-2xl font-bold">{stats.total || 0}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-blue-700">Solved Petitions</h3>
                <p className="text-2xl font-bold">{stats.solved || 0}</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-xl shadow text-center">
                <h3 className="text-lg font-semibold text-purple-700">Reputation Score</h3>
                <p className="text-2xl font-bold">{reputation}</p>
              </div>
            </div>
          </>
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
                  <div className="mt-2 space-x-2">
                    {p.status !== "Resolved" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(p._id, "In-Progress")}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Pick Up
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(p._id, "Resolved")}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(p._id, "Escalated")}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Escalate
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">My Profile</h3>
            <p><b>Role:</b> Non-Ruling Party</p>
            <p><b>State:</b> {state}</p>
            <p><b>Reputation Score:</b> {reputation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
