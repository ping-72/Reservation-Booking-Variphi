const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { Ticket } = require("../models");
const db = require("../config/database");

// Public routes - no authentication required
// Get unique cities for dropdowns
router.get("/cities", async (req, res) => {
  try {
    // Get all unique origin cities
    const origins = await Ticket.findAll({
      attributes: [
        [db.sequelize.fn("DISTINCT", db.sequelize.col("origin")), "city"],
      ],
      raw: true,
    });

    // Get all unique destination cities
    const destinations = await Ticket.findAll({
      attributes: [
        [db.sequelize.fn("DISTINCT", db.sequelize.col("destination")), "city"],
      ],
      raw: true,
    });

    // Combine and remove duplicates
    const allCities = [...origins, ...destinations]
      .map((item) => item.city)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();

    res.json(allCities);
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({ message: "Failed to fetch cities" });
  }
});

// Search tickets - Public
router.get("/search", ticketController.searchTickets);

// Get tickets by ID - Public
router.get("/:id", ticketController.getTicketById);

// Routes below this line require authentication
router.use(authenticate);

// Get all tickets - Admin only
router.get("/", authorize(["admin"]), ticketController.getAllTickets);

// Create ticket - Admin only
router.post("/", authorize(["admin"]), ticketController.createTicket);

// Update ticket - Admin only
router.put("/:id", authorize(["admin"]), ticketController.updateTicket);

// Delete ticket - Admin only
router.delete("/:id", authorize(["admin"]), ticketController.deleteTicket);

// Get popular routes - Authenticated users
router.get("/popular-routes", ticketController.getPopularRoutes);

// Get airlines - Authenticated users
router.get("/airlines", ticketController.getAirlines);

module.exports = router;
