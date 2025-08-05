// models/Petition.js
{
  title,
  description,
  state,
  submittedBy,
  assignedTo, // Party
  status: ['pending', 'solved', 'escalated'],
  escalatedTo: String, // Party ID
  createdAt, updatedAt
}
