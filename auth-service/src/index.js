// Load environment variables from .env file
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const logger = require("./middleware/logger.middleware");
const { errorHandler } = require("./middleware/error.middleware");

// Log environment variables (without sensitive values)
console.log("Environment variables loaded:", {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not Set",
  DB_URL: process.env.DB_URL ? "Set" : "Not Set",
});

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/auth", authRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling
app.use(errorHandler);

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
    app.listen(PORT, () => {
      console.log(`Auth service is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
