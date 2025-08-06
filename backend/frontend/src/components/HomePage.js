import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [stats, setStats] = useState({ total: 0, solved: 0, active: 0, welfareIndex: 0 });

  useEffect(() => {
    axios.get('http://localhost:5000/api/petitions/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">State Welfare Index</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-100 rounded">Total Petitions: {stats.total}</div>
        <div className="p-4 bg-green-100 rounded">Solved: {stats.solved}</div>
        <div className="p-4 bg-yellow-100 rounded">Active: {stats.active}</div>
        <div className="p-4 bg-purple-100 rounded">Welfare Index: {stats.welfareIndex}%</div>
      </div>
    </div>
  );
};

export default HomePage;
