const Reservation = require("../models/reservation.model");
const axios = require("axios");

const TICKET_SERVICE_URL =
  process.env.TICKET_SERVICE_URL || "http://localhost:5002";

// Helper function to fetch ticket details
const getTicketDetails = async (ticketId, token) => {
  try {
    const response = await axios.get(
      `${TICKET_SERVICE_URL}/api/tickets/${ticketId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.ticket;
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    throw new Error("Invalid ticket or ticket service unavailable");
  }
};

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const {
      ticketId,
      passengerName,
      passengerEmail,
      passengerPhone,
      seatNumber,
      notes,
    } = req.body;

    if (!ticketId || !passengerName || !passengerEmail) {
      return res.status(400).json({
        message:
          "Missing required fields. TicketId, passengerName, and passengerEmail are required.",
      });
    }

    // Get the token from the request
    const token = req.headers.authorization.split(" ")[1];

    // Check if the ticket exists and is available
    try {
      const ticket = await getTicketDetails(ticketId, token);

      // Check if seats are available
      if (ticket.seatsAvailable <= 0) {
        return res
          .status(400)
          .json({ message: "No seats available for this ticket" });
      }
    } catch (error) {
      return res
        .status(404)
        .json({ message: "Ticket not found or unavailable" });
    }

    // Create the reservation
    const reservation = await Reservation.create({
      userId: req.user.id,
      ticketId,
      passengerName,
      passengerEmail,
      passengerPhone,
      seatNumber,
      status: "pending",
      notes,
    });

    res.status(201).json({
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Error creating reservation" });
  }
};

// Get all reservations (for the requesting user or all if admin)
exports.getReservations = async (req, res) => {
  try {
    // Admin can see all, users can only see their own
    const whereClause =
      req.user.role === "admin" ? {} : { userId: req.user.id };

    const reservations = await Reservation.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Reservations retrieved successfully",
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Error fetching reservations" });
  }
};

// Get all reservations (admin only)
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "All reservations retrieved successfully",
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    res.status(500).json({ message: "Error fetching all reservations" });
  }
};

// Get user's reservations
exports.getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "User reservations retrieved successfully",
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({ message: "Error fetching user reservations" });
  }
};

// Get reservations for a specific ticket
exports.getReservationsByTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Admin can see all, users can only see their own
    const whereClause = { ticketId };

    if (req.user.role !== "admin") {
      whereClause.userId = req.user.id;
    }

    const reservations = await Reservation.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Ticket reservations retrieved successfully",
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Error fetching ticket reservations:", error);
    res.status(500).json({ message: "Error fetching ticket reservations" });
  }
};

// Get a specific reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check if user is authorized to view this reservation
    if (req.user.role !== "admin" && reservation.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this reservation" });
    }

    res.json({
      message: "Reservation retrieved successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: "Error fetching reservation" });
  }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check if user is authorized to update this reservation
    if (req.user.role !== "admin" && reservation.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this reservation" });
    }

    // Update the reservation
    const {
      passengerName,
      passengerEmail,
      passengerPhone,
      seatNumber,
      status,
      notes,
    } = req.body;

    await reservation.update({
      passengerName: passengerName || reservation.passengerName,
      passengerEmail: passengerEmail || reservation.passengerEmail,
      passengerPhone: passengerPhone || reservation.passengerPhone,
      seatNumber: seatNumber || reservation.seatNumber,
      status: status || reservation.status,
      notes: notes || reservation.notes,
    });

    res.json({
      message: "Reservation updated successfully",
      reservation,
    });
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Error updating reservation" });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Check if user is authorized to delete this reservation
    if (req.user.role !== "admin" && reservation.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this reservation" });
    }

    // Delete the reservation
    await reservation.destroy();

    res.json({
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Error deleting reservation" });
  }
};
