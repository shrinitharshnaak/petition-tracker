import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [petitions, setPetitions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/petition/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPetitions(res.data.petitions))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl mb-3">All Petitions</h2>
      {petitions.map((p) => (
        <div key={p._id} className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="font-semibold">{p.title}</h3>
          <p>{p.description}</p>
          <p className="text-sm text-gray-500">State: {p.state}</p>
          <p className="text-sm text-gray-500">Signatures: {p.signatures}</p>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
