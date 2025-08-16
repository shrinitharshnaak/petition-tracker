import React, { useEffect, useState } from "react";
import axios from "axios";

function RulingDashboard() {
  const [petitions, setPetitions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/petition/my-state", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPetitions(res.data.petitions))
      .catch((err) => console.error(err));
  }, [token]);

  const solvePetition = async (id) => {
    await axios.put(
      `http://localhost:5000/api/petition/${id}/solve`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setPetitions((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Ruling Party Dashboard</h1>
      <h2 className="text-xl mb-3">Petitions in Your State</h2>
      {petitions.map((p) => (
        <div key={p._id} className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="font-semibold">{p.title}</h3>
          <p>{p.description}</p>
          <button
            onClick={() => solvePetition(p._id)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
          >
            Mark as Solved
          </button>
        </div>
      ))}
    </div>
  );
}

export default RulingDashboard;
