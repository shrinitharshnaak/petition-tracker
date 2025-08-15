import React from "react";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Gradient header (top only) */}
      <div className="bg-gradient-to-br from-blue-600 to-green-500 text-white py-6 px-6">
        <h1 className="text-2xl font-semibold">PeoplePulse Dashboard</h1>
      </div>

      {/* Main content */}
      <div className="flex-grow max-w-5xl mx-auto py-8 px-4 space-y-6">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Total Petitions</p>
            <h3 className="text-3xl font-semibold">15</h3>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Active</p>
            <h3 className="text-3xl font-semibold">10</h3>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Solved</p>
            <h3 className="text-3xl font-semibold">5</h3>
          </div>
          <div className="bg-white p-4 rounded-xl shadow text-center">
            <p className="text-gray-500 text-sm">Total Signatures</p>
            <h3 className="text-3xl font-semibold">45</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
