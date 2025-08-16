import React, { useState } from "react";
import { apiRequest } from "../api";

export default function CreatePetition({ token }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/petition", "POST", { title, description, state }, token);
      setMsg("Petition submitted successfully!");
      setTitle("");
      setDescription("");
      setState("");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-3">Create Petition</h2>
      {msg && <p className="mb-2 text-green-600">{msg}</p>}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 w-full mb-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="border p-2 w-full mb-2"
      />
      <input
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="State"
        className="border p-2 w-full mb-2"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
