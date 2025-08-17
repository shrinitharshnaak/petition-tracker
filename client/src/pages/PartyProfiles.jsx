import React, { useEffect, useState } from "react";

export default function PartyProfiles() {
  const [parties, setParties] = useState([]);

  useEffect(() => {
    const fetchParties = async () => {
      const res = await fetch("/api/party/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setParties(data || []);
    };
    fetchParties();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4 text-green-600">Party Profiles</h2>
      {parties.length > 0 ? (
        <ul className="space-y-3">
          {parties.map((p) => (
            <li key={p._id} className="p-3 bg-white shadow rounded-lg flex justify-between">
              <span>{p.name}</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                Reputation: {p.reputationScore}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No parties found.</p>
      )}
    </div>
  );
}
