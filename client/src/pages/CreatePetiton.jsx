// ==== CreatePetition.jsx ====
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreatePetition() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/petition/submit", { title, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Petition submitted!");
      navigate("/citizen/dashboard");
    } catch (err) {
      alert("Error submitting");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-400">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow w-full max-w-lg">
        <h2 className="text-2xl text-center mb-4 text-blue-600">Create Petition</h2>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Title" required className="w-full p-2 border rounded mb-3" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder="Description" rows={4} required className="w-full p-2 border rounded mb-4"></textarea>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
