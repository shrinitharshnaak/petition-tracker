import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function RulingDashboard() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [petitions, setPetitions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/petition/my-state", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPetitions(res.data.petitions))
      .catch(err => console.error(err));
  }, [token]);

  const handleSolve = async (id) => {
    await axios.put(`http://localhost:5000/api/petition/${id}/solve`, {},
      { headers: { Authorization: `Bearer ${token}` } });
    alert("Solved!");
    // reload
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-400 p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Ruling Party Dashboard</h2>

      {petitions.map((p) => (
        <div key={p._id} className="bg-white p-4 rounded mb-3">
          <h3 className="font-semibold">{p.title}</h3>
          <p>{p.description}</p>
          <p>Status: {p.status}</p>
          {p.status !== "Solved" && (
            <button onClick={() => handleSolve(p._id)} className="bg-green-600 text-white px-3 py-1 mt-2 rounded">Mark Solved</button>
          )}
        </div>
      ))}
    </div>
  );
}
