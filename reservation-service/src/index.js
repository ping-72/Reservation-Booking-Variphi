require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./config/database");
const reservationRoutes = require("./routes/reservation.routes");
const ticketRoutes = require("./routes/ticket.routes");
const logger = require("./middleware/logger.middleware");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use("/api/reservations", reservationRoutes);
app.use("/api/tickets", ticketRoutes);

// Health check route
app.get("/health", (req, res) => {
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
      console.log(`Reservation service is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
