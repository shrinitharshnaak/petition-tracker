import React, { useEffect, useState } from "react";
import axios from "axios";

function CitizenDashboard() {
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-green-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Citizen Dashboard</h1>
      <h2 className="text-xl mb-3">Petitions in Your State</h2>
      <ul className="space-y-3">
        {petitions.map((p) => (
          <li key={p._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <p>{p.description}</p>
            <p className="text-sm text-gray-500">Signatures: {p.signatures}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CitizenDashboard;
