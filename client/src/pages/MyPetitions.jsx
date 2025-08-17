// ==== MyPetitions.jsx ====
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyPetitions() {
  const token = localStorage.getItem("token");
  const [myPetitions, setMyPetitions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/petition/my-owned", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setMyPetitions(res.data.petitions))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-r from-blue-500 to-green-400 p-8">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-3xl">
        <h2 className="text-2xl mb-4 text-blue-600 font-bold">My Petitions</h2>
        {myPetitions.length === 0 ? (
          <p>No petitions created yet.</p>
        ) : (
          myPetitions.map((p) => (
            <div key={p._id} className="border p-3 rounded mb-3 bg-gray-50">
              <h3 className="font-semibold">{p.title}</h3>
              <p>{p.description}</p>
              <small>Status: {p.status}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
