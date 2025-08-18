import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CitizenDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [petitions, setPetitions] = useState([]);
  const [myPetitions, setMyPetitions] = useState([]);
  const [stats, setStats] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const citizenId = localStorage.getItem("userId");
  const state = localStorage.getItem("state");

  const config = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [petitionsRes, myPetitionsRes, statsRes, leaderboardRes] =
          await Promise.all([
            axios.get("http://localhost:5000/api/petitions", config),
            axios.get(`http://localhost:5000/api/petitions/citizen/${citizenId}`, config),
            axios.get("http://localhost:5000/api/stats", config),
            axios.get("http://localhost:5000/api/leaderboard", config),
          ]);

        setPetitions(petitionsRes.data || []);
        setMyPetitions(myPetitionsRes.data || []);
        setStats(statsRes.data || {});
        setLeaderboard(leaderboardRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && citizenId) fetchData();
    else navigate("/login", { replace: true });
  }, [citizenId, config, navigate, token]);

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
      state: state || "Unknown",
      status: "Active",
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/petitions",
        newPetition,
        config
      );
      setPetitions([res.data, ...petitions]);
      setMyPetitions([res.data, ...myPetitions]);
      form.reset();
      alert("Petition created successfully!");
    } catch (err) {
      console.error("Error creating petition:", err);
      alert("Failed to create petition");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-6xl mx-auto">
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
                activeTab === tab ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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

        {activeTab === "create" && (
          <form onSubmit={handleCreatePetition} className="space-y-4">
            <input type="text" name="title" placeholder="Petition Title" className="w-full p-3 border rounded-lg" required />
            <textarea name="description" placeholder="Petition Description" className="w-full p-3 border rounded-lg" rows="4" required />
            <input type="text" name="state" value={state || ""} readOnly className="w-full p-3 border rounded-lg bg-gray-100" />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Submit Petition
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
