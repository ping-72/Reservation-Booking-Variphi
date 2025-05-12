const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");

// Get all tickets
router.get("/", ticketController.getAllTickets);

// Search tickets
router.get("/search", ticketController.searchTickets);

// Get available airlines
router.get("/airlines", ticketController.getAirlines);

// Get popular routes
router.get("/popular-routes", ticketController.getPopularRoutes);

// Get ticket by ID
router.get("/:id", ticketController.getTicketById);

module.exports = router;
