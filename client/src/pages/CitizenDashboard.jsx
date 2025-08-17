// ==== CitizenDashboard.jsx ====
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CitizenDashboard() {
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({ total: 0, active: 0, solved: 0, welfare: 0 });
  const [tab, setTab] = useState("petitions");
  const [search, setSearch] = useState("");
  const [petitions, setPetitions] = useState([]);
  const [topPetitions, setTopPetitions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchStats();
    fetchPetitions();
    fetchLeaderboard();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/petition/stats/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats({
        total: res.data.total,
        active: res.data.active,
        solved: res.data.solved,
        welfare: res.data.signatures,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPetitions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/petition/my-state", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPetitions(res.data.petitions);
      setTopPetitions(res.data.petitions.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaderboard(res.data.leaderboard);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPetitions = petitions.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-400 flex flex-col">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">Citizen Dashboard</div>
        <nav>
          <Link to="/citizen/dashboard" className="mx-2">Dashboard</Link>
          <Link to="/citizen/create" className="mx-2">Create Petition</Link>
          <Link to="/citizen/mypetitions" className="mx-2">My Petitions</Link>
          <Link to="/citizen/profile" className="mx-2">Profile</Link>
          <button onClick={handleLogout} className="ml-4 text-red-600">Logout</button>
        </nav>
      </header>

      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white">
          <div className="bg-blue-600 p-4 rounded-xl shadow text-center">
            <p>Total Petitions</p>
            <h3 className="text-2xl">{stats.total}</h3>
          </div>
          <div className="bg-green-600 p-4 rounded-xl shadow text-center">
            <p>Active</p>
            <h3 className="text-2xl">{stats.active}</h3>
          </div>
          <div className="bg-purple-600 p-4 rounded-xl shadow text-center">
            <p>Solved</p>
            <h3 className="text-2xl">{stats.solved}</h3>
          </div>
          <div className="bg-yellow-500 p-4 rounded-xl shadow text-center">
            <p>Welfare Index</p>
            <h3 className="text-2xl">{stats.welfare}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex space-x-4 mb-3">
            <button onClick={() => setTab("petitions")} className={`px-4 py-2 rounded ${tab === "petitions" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              Petitions
            </button>
            <button onClick={() => setTab("parties")} className={`px-4 py-2 rounded ${tab === "parties" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              Parties
            </button>
          </div>

          <input placeholder={`Search ${tab}...`} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border p-2 rounded mb-3" />

          {tab === "petitions" ? (
            filteredPetitions.map((p) => (
              <div key={p._id} className="bg-gray-100 p-3 mb-2 rounded shadow">
                <Link to={`/citizen/petition/${p._id}`} className="font-semibold text-blue-600 underline">{p.title}</Link>
                <p>{p.description}</p>
              </div>
            ))
          ) : (
            leaderboard.slice(0, 3).map((party, idx) => (
              <div key={party._id || idx} className="bg-gray-100 p-3 mb-2 rounded shadow">
                {idx + 1}. {party.name} — Score: {party.reputation}
              </div>
            ))
          )}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-md text-gray-800">
          <h3 className="mb-2 font-semibold">Top Petitions</h3>
          {topPetitions.map((p) => (
            <div key={p._id} className="bg-gray-100 p-3 mb-2 rounded">{p.title} — {p.signatures} votes</div>
          ))}
        </div>
      </main>
    </div>
  );
}
