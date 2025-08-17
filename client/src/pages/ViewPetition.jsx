// ==== ViewPetition.jsx ====
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ViewPetition() {
  const { id } = useParams();
  const [petition, setPetition] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/petition/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setPetition(res.data.petition))
      .catch(console.error);
  }, [id, token]);

  const signPetition = async () => {
    try {
      await axios.put(`http://localhost:5000/api/petition/${id}/sign`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("You signed this petition.");
      navigate("/citizen/dashboard");
    } catch (err) {
      alert("Already signed or error");
    }
  };

  if (!petition) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-2">{petition.title}</h2>
        <p className="mb-2">{petition.description}</p>
        <p>Status: {petition.status}</p>
        <p>Signatures: {petition.signatures}</p>

        <button
          onClick={signPetition}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Sign Petition
        </button>
      </div>
    </div>
  );
}
