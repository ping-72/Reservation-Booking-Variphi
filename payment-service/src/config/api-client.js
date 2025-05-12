const axios = require("axios");

// Service URLs from environment variables with fallbacks
const RESERVATION_SERVICE_URL =
  process.env.RESERVATION_SERVICE_URL || "http://reservation-service:5002";
const TICKET_SERVICE_URL =
  process.env.TICKET_SERVICE_URL || "http://ticket-service:5003";

// Add debug logging
console.log("Using reservation service URL:", RESERVATION_SERVICE_URL);
console.log("Using ticket service URL:", TICKET_SERVICE_URL);

/**
 * Get reservation details by ID
 * @param {string} reservationId - The ID of the reservation
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Reservation details
 */
async function getReservationById(reservationId, token) {
  try {
    console.log(`Fetching reservation with ID: ${reservationId}`);
    const requestUrl = `${RESERVATION_SERVICE_URL}/api/reservations/${reservationId}`;
    console.log(`Making request to: ${requestUrl}`);

    const response = await axios.get(requestUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Reservation service response:", JSON.stringify(response.data));
    return response.data.reservation;
  } catch (error) {
    console.error(
      "Error fetching reservation:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch reservation details");
  }
}

/**
 * Update reservation status
 * @param {string} reservationId - The ID of the reservation
 * @param {string} status - New status (pending, confirmed, cancelled)
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Updated reservation
 */
async function updateReservationStatus(reservationId, status, token) {
  try {
    const response = await axios.put(
      `${RESERVATION_SERVICE_URL}/api/reservations/${reservationId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.reservation;
  } catch (error) {
    console.error(
      "Error updating reservation:",
      error.response?.data || error.message
    );
    throw new Error("Failed to update reservation status");
  }
}

/**
 * Get ticket details by ID
 * @param {string} ticketId - The ID of the ticket
 * @param {string} token - JWT token for authentication
 * @returns {Promise<Object>} - Ticket details
 */
async function getTicketById(ticketId, token) {
  try {
    console.log(`Fetching ticket with ID: ${ticketId}`);
    const requestUrl = `${TICKET_SERVICE_URL}/api/tickets/${ticketId}`;
    console.log(`Making request to: ${requestUrl}`);

    const response = await axios.get(requestUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Ticket service response:", JSON.stringify(response.data));
    return response.data.ticket;
  } catch (error) {
    console.error(
      "Error fetching ticket:",
      error.response?.data || error.message,
      error.response?.status
    );
    console.error("Full error object:", JSON.stringify(error.response || {}));
    throw new Error("Failed to fetch ticket details");
  }
}

module.exports = {
  getReservationById,
  updateReservationStatus,
  getTicketById,
};
