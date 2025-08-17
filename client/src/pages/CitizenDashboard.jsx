import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CitizenDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [petitions, setPetitions] = useState([]);
  const [myPetitions, setMyPetitions] = useState([]);
  const [stats, setStats] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock logged-in citizen (replace with auth later)
  const citizenId = "citizen123";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petitionsRes = await axios.get("http://localhost:5000/api/petitions");
        setPetitions(petitionsRes.data || []);

        const myPetitionsRes = await axios.get(`http://localhost:5000/api/petitions/citizen/${citizenId}`);
        setMyPetitions(myPetitionsRes.data || []);

        const statsRes = await axios.get("http://localhost:5000/api/stats");
        setStats(statsRes.data || {});

        const leaderboardRes = await axios.get("http://localhost:5000/api/leaderboard");
        setLeaderboard(leaderboardRes.data || []);

        const partiesRes = await axios.get("http://localhost:5000/api/parties");
        setParties(partiesRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Petition Submission
  const handleCreatePetition = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newPetition = {
      title: form.title.value,
      description: form.description.value,
      citizenId,
      status: "Pending",
    };

    try {
      const res = await axios.post("http://localhost:5000/api/petitions", newPetition);
      setPetitions([res.data, ...petitions]);
      setMyPetitions([res.data, ...myPetitions]);
      form.reset();
      alert("Petition created successfully!");
    } catch (err) {
      console.error("Error creating petition:", err);
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
          Citizen Dashboard
        </h2>

        {/* 🔹 Tabs */}
        <div className="flex justify-center mb-6 space-x-4">
          {["dashboard", "create", "myPetitions", "browse", "profile", "parties"].map((tab) => (
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
              {tab === "parties" && "🏛 Party Profiles"}
            </button>
          ))}
        </div>

        {/* 🔹 Tab Contents */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats */}
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

            {/* Leaderboard */}
            <h3 className="text-2xl font-bold text-green-600 mb-4">Leaderboard</h3>
            <table className="w-full border-collapse border border-gray-300 shadow rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-green-200 text-left">
                  <th className="p-2 border border-gray-300">Name</th>
                  <th className="p-2 border border-gray-300">Role</th>
                  <th className="p-2 border border-gray-300">Solved Petitions</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-100">
                    <td className="p-2 border border-gray-300">{user.name}</td>
                    <td className="p-2 border border-gray-300 capitalize">{user.role}</td>
                    <td className="p-2 border border-gray-300">{user.solvedCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === "create" && (
          <form onSubmit={handleCreatePetition} className="space-y-4">
            <input type="text" name="title" placeholder="Petition Title" className="w-full p-3 border rounded-lg" required />
            <textarea name="description" placeholder="Petition Description" className="w-full p-3 border rounded-lg" rows="4" required />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
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
            <p><b>Name:</b> John Doe</p>
            <p><b>Email:</b> john@example.com</p>
            <p><b>Role:</b> Citizen</p>
          </div>
        )}

        {activeTab === "parties" && (
          <div>
            <h3 className="text-2xl font-bold text-green-600 mb-4">Party Profiles</h3>
            <ul className="space-y-4">
              {parties.map((party) => (
                <li key={party._id} className="border p-4 rounded-lg shadow">
                  <h4 className="font-semibold text-lg">{party.name}</h4>
                  <p>Role: {party.role}</p>
                  <p>Solved Petitions: {party.solvedCount}</p>
                  <p>Reputation Score: {party.reputationScore}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
