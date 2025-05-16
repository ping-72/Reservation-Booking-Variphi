require("dotenv").config();

// Determine if we're running in Docker or local development
// In Docker, services are available at their service names (e.g., auth-service)
// In local development, they're available on localhost
const useDockerHostnames = process.env.USE_DOCKER_HOSTNAMES === "true";

// Base URLs depending on environment
const serviceBaseURLs = useDockerHostnames
  ? {
      auth: "http://auth-service:5000",
      ticket: "http://ticket-service:5003",
      reservation: "http://reservation-service:5002",
      payment: "http://payment-service:5004",
    }
  : {
      auth: "http://localhost:5000",
      ticket: "http://localhost:5003",
      reservation: "http://localhost:5002",
      payment: "http://localhost:5004",
    };

module.exports = {
  port: process.env.PORT || 5001,
  environment: process.env.NODE_ENV || "development",

  // Service URLs with environment variable overrides
  services: {
    auth: process.env.AUTH_SERVICE_URL || serviceBaseURLs.auth,
    ticket: process.env.TICKET_SERVICE_URL || serviceBaseURLs.ticket,
    reservation:
      process.env.RESERVATION_SERVICE_URL || serviceBaseURLs.reservation,
    payment: process.env.PAYMENT_SERVICE_URL || serviceBaseURLs.payment,
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "flight_booking_secret_key",
  },
};
