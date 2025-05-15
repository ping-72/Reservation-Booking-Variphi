const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config/config");

// Import routes
const authRoutes = require("./routes/auth.routes");
const ticketRoutes = require("./routes/ticket.routes");
const reservationRoutes = require("./routes/reservation.routes");
const paymentRoutes = require("./routes/payment.routes");

// Initialize Express app
const app = express();

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin resource sharing
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

// Logging
app.use(morgan(config.environment === "development" ? "dev" : "combined"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/payment", paymentRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Flight Reservation System API Gateway",
    services: {
      auth: "/api/auth",
      ticket: "/api/ticket",
      reservation: "/api/reservation",
      payment: "/api/payment",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    error: config.environment === "development" ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(
    `API Gateway running on port ${PORT} in ${config.environment} mode`
  );
  console.log("Available services:");
  Object.entries(config.services).forEach(([key, url]) => {
    console.log(`- ${key}: ${url}`);
  });
});
