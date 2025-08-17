import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NonRulingDashboard() {
  const token = localStorage.getItem("token");
  const [petitions, setPetitions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/petition/my-state", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPetitions(res.data.petitions))
      .catch(err => console.error(err));
  }, [token]);

  const escalate = async (id) => {
    await axios.put(`http://localhost:5000/api/petition/${id}/escalate`, {},
      { headers: { Authorization: `Bearer ${token}` } });
    alert("Escalated!");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-500 to-yellow-400 p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Non-Ruling Party Dashboard</h2>

      {petitions.map(p => (
        <div key={p._id} className="bg-white p-4 rounded mb-3">
          <h3 className="font-semibold">{p.title}</h3>
          <p>{p.description}</p>
          <p>Status: {p.status}</p>
          {p.status === 'Active' && (
            <button onClick={() => escalate(p._id)} className="bg-red-600 text-white px-3 py-1 mt-2 rounded">Escalate</button>
          )}
        </div>
      ))}
    </div>
  );
}
