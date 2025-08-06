import React, { useState } from 'react';
import axios from 'axios';

const SubmitPetition = () => {
  const [form, setForm] = useState({ title: '', description: '', state: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/petitions', form);
      alert('Petition submitted successfully!');
      setForm({ title: '', description: '', state: '' });
    } catch (error) {
      console.error(error);
      alert('Submission failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Submit Petition</h2>
      <input name="title" value={form.title} onChange={handleChange}
        placeholder="Title" className="w-full p-2 border mb-4" />
      <textarea name="description" value={form.description} onChange={handleChange}
        placeholder="Description" className="w-full p-2 border mb-4" />
      <input name="state" value={form.state} onChange={handleChange}
        placeholder="State" className="w-full p-2 border mb-4" />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
};

export default SubmitPetition;
