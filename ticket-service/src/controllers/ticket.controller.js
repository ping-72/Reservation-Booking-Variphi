const Ticket = require("../models/ticket.model");
const { Op } = require("sequelize");

// Get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.json({
      message: "Tickets retrieved successfully",
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
};

// Get ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({
      message: "Ticket retrieved successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Error fetching ticket" });
  }
};

// Search tickets
exports.searchTickets = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      class: ticketClass,
    } = req.query;

    if (!origin || !destination) {
      return res
        .status(400)
        .json({ message: "Origin and destination are required" });
    }

    const whereClause = {};

    // Extract city name without airport code if possible
    const originSearchTerm = origin.split("(")[0].trim().toLowerCase();
    whereClause.origin = Ticket.sequelize.where(
      Ticket.sequelize.fn("LOWER", Ticket.sequelize.col("origin")),
      "LIKE",
      `%${originSearchTerm}%`
    );

    // Extract city name without airport code if possible
    const destSearchTerm = destination.split("(")[0].trim().toLowerCase();
    whereClause.destination = Ticket.sequelize.where(
      Ticket.sequelize.fn("LOWER", Ticket.sequelize.col("destination")),
      "LIKE",
      `%${destSearchTerm}%`
    );

    // Only add departureDate to query if it's provided
    if (departureDate) {
      whereClause.departureDate = departureDate;
    }

    // Add ticket class filter if provided
    if (ticketClass) {
      whereClause.class = ticketClass;
    }

    const tickets = await Ticket.findAll({
      where: whereClause,
      order: [
        ["departureDate", "ASC"],
        ["departureTime", "ASC"],
      ],
    });

    res.json({
      message: "Search results",
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Error searching tickets:", error);
    res.status(500).json({ message: "Error searching tickets" });
  }
};

// Get available airlines
exports.getAirlines = async (req, res) => {
  try {
    const airlines = await Ticket.findAll({
      attributes: ["airline"],
      group: ["airline"],
      order: [["airline", "ASC"]],
    });

    res.json({
      message: "Airlines retrieved successfully",
      airlines: airlines.map((item) => item.airline),
    });
  } catch (error) {
    console.error("Error fetching airlines:", error);
    res.status(500).json({ message: "Error fetching airlines" });
  }
};

// Get popular routes (top 5 origin-destination pairs)
exports.getPopularRoutes = async (req, res) => {
  try {
    const popularRoutes = await Ticket.findAll({
      attributes: ["origin", "destination"],
      group: ["origin", "destination"],
      order: [
        ["origin", "ASC"],
        ["destination", "ASC"],
      ],
      limit: 5,
    });

    res.json({
      message: "Popular routes retrieved successfully",
      routes: popularRoutes.map((route) => ({
        origin: route.origin,
        destination: route.destination,
      })),
    });
  } catch (error) {
    console.error("Error fetching popular routes:", error);
    res.status(500).json({ message: "Error fetching popular routes" });
  }
};

// Create ticket
exports.createTicket = async (req, res) => {
  try {
    const {
      flightNumber,
      origin,
      destination,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      price,
      class: ticketClass,
      airline,
      seatsAvailable,
    } = req.body;

    // Validate required fields
    if (
      !flightNumber ||
      !origin ||
      !destination ||
      !departureDate ||
      !airline
    ) {
      return res.status(400).json({
        message:
          "Missing required fields. Flight number, origin, destination, departure date, and airline are required.",
      });
    }

    // Create the ticket
    const ticket = await Ticket.create({
      flightNumber,
      origin,
      destination,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      price,
      class: ticketClass,
      airline,
      seatsAvailable,
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Error creating ticket" });
  }
};

// Update ticket
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      flightNumber,
      origin,
      destination,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      price,
      class: ticketClass,
      airline,
      seatsAvailable,
    } = req.body;

    // Find the ticket
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Update the ticket
    await ticket.update({
      flightNumber: flightNumber || ticket.flightNumber,
      origin: origin || ticket.origin,
      destination: destination || ticket.destination,
      departureDate: departureDate || ticket.departureDate,
      departureTime: departureTime || ticket.departureTime,
      arrivalDate: arrivalDate || ticket.arrivalDate,
      arrivalTime: arrivalTime || ticket.arrivalTime,
      price: price || ticket.price,
      class: ticketClass || ticket.class,
      airline: airline || ticket.airline,
      seatsAvailable:
        seatsAvailable !== undefined ? seatsAvailable : ticket.seatsAvailable,
    });

    res.json({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    res.status(500).json({ message: "Error updating ticket" });
  }
};

// Delete ticket
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the ticket
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Delete the ticket
    await ticket.destroy();

    res.json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Error deleting ticket" });
  }
};
