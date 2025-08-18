// server/middleware/verifyToken.js
const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ error: "Invalid token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
