const jwt = require('jsonwebtoken');

// ✅ 1. Token verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains { id, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
}

// ✅ 2. Role check middleware
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied: Wrong role' });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  requireRole
};
