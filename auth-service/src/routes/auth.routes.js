const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

// Auth routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", authenticate, getCurrentUser);
router.get("/profile", authenticate, getCurrentUser);

module.exports = router;
