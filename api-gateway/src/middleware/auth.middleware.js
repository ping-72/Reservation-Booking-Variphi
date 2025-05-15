const jwt = require("jsonwebtoken");
const config = require("../config/config");

/**
 * Middleware to verify JWT token
 * Extracts token from Authorization header and verifies it
 */
const verifyToken = (req, res, next) => {
  // Get authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: No token provided",
    });
  }

  // Check if the format is Bearer [token]
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: Token error",
    });
  }

  const token = parts[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // Add user info to request
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized: Invalid token",
    });
  }
};

module.exports = {
  verifyToken,
};
