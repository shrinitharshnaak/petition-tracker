import React, { useEffect, useState } from "react";

export default function BrowsePetitions() {
  const [petitions, setPetitions] = useState([]);

  useEffect(() => {
    const fetchPetitions = async () => {
      const res = await fetch("/api/petition/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setPetitions(data || []);
    };
    fetchPetitions();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4 text-green-600">Browse Petitions</h2>
      {petitions.length > 0 ? (
        <ul className="space-y-3">
          {petitions.map((p) => (
            <li key={p._id} className="p-3 bg-white shadow rounded-lg flex justify-between">
              <span>{p.title}</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">{p.status}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No petitions available.</p>
      )}
    </div>
  );
}
