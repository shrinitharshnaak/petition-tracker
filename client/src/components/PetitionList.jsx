import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function PetitionList({ token, role }) {
  const [petitions, setPetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPetitions = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("/petition", "GET", null, token);
      setPetitions(data.petitions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async (id) => {
    try {
      await apiRequest(`/petition/${id}/sign`, "PUT", null, token);
      fetchPetitions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSolve = async (id) => {
    try {
      await apiRequest(`/petition/${id}/solve`, "PUT", null, token);
      fetchPetitions();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEscalate = async (id) => {
    try {
      await apiRequest(`/petition/${id}/escalate`, "PUT", null, token);
      fetchPetitions();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, []);

  if (loading) return <p>Loading petitions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Petitions</h2>
      {petitions.map((p) => (
        <div key={p._id} className="border p-4 mb-3 rounded bg-white shadow">
          <h3 className="text-lg font-semibold">{p.title}</h3>
          <p>{p.description}</p>
          <p><strong>State:</strong> {p.state}</p>
          <p><strong>Status:</strong> {p.status}</p>
          <p><strong>Signatures:</strong> {p.signatures}</p>

          {/* Actions based on role */}
          {role === "citizen" && p.status === "Active" && (
            <button
              onClick={() => handleSign(p._id)}
              className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
            >
              Sign Petition
            </button>
          )}

          {role === "non-ruling" && p.status === "Active" && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleSolve(p._id)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Solve
              </button>
              <button
                onClick={() => handleEscalate(p._id)}
                className="bg-yellow-500 text-black px-3 py-1 rounded"
              >
                Escalate
              </button>
            </div>
          )}

          {role === "ruling" && p.status === "Escalated" && (
            <button
              onClick={() => handleSolve(p._id)}
              className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
            >
              Solve Escalated
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
