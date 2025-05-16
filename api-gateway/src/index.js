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
app.use(
  helmet({
    // Disable contentSecurityPolicy for development
    contentSecurityPolicy: config.environment === "production",
  })
);

// Configure CORS to allow all origins in development
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request body with increased limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware with request body for development
app.use((req, res, next) => {
  if (config.environment === "development") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log("Request Body:", JSON.stringify(req.body, null, 2));
    }
  }
  next();
});

// Standard logging
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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "up",
    timestamp: new Date().toISOString(),
    services: {
      auth: config.services.auth,
      ticket: config.services.ticket,
      reservation: config.services.reservation,
      payment: config.services.payment,
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);

  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
    error: config.environment === "development" ? err.stack : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.url}`,
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
