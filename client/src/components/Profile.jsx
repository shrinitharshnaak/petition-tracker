import React, { useEffect, useState } from "react";
import { apiRequest } from "../api";

export default function Profile({ token, userId }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiRequest(`/user/profile/${userId}`, "GET", null, token)
      .then(setProfile)
      .catch((err) => alert(err.message));
  }, [token, userId]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p><strong>Name:</strong> {profile.user.name}</p>
      <p><strong>Email:</strong> {profile.user.email}</p>
      <p><strong>Role:</strong> {profile.user.role}</p>
      <p><strong>State:</strong> {profile.user.state}</p>
      <p><strong>Reputation:</strong> {profile.user.reputation}</p>
      <p><strong>Issues Solved:</strong> {profile.metrics.issuesSolved}</p>
      <p><strong>Escalated Solved:</strong> {profile.metrics.escalatedSolved}</p>
    </div>
  );
}
