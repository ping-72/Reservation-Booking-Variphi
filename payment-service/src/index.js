require("dotenv").config();
const express = require("express");
const cors = require("cors");
const {
  sequelize,
  testConnection,
  syncDatabase,
} = require("./config/database");
const paymentRoutes = require("./routes/payment.routes");
const logger = require("./middleware/logger.middleware");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/payments", paymentRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Razorpay webhook route for automated notifications
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    console.log("Received webhook from Razorpay");

    // In a real app, you would verify the webhook signature and process the event
    // For now, just acknowledge receipt
    res.status(200).json({ received: true });
  }
);

// Error handling
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models with database
    await syncDatabase();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Payment service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
