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
      returnDate,
      class: ticketClass,
    } = req.query;

    const whereClause = {};

    if (origin) {
      whereClause.origin = { [Op.iLike]: `%${origin}%` };
    }

    if (destination) {
      whereClause.destination = { [Op.iLike]: `%${destination}%` };
    }

    if (departureDate) {
      whereClause.departureDate = departureDate;
    }

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
