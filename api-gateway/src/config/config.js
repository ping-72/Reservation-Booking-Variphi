require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5001,
  environment: process.env.NODE_ENV || "development",

  // Service URLs
  services: {
    auth: process.env.AUTH_SERVICE_URL || "http://auth-service:5000",
    ticket: process.env.TICKET_SERVICE_URL || "http://ticket-service:5003",
    reservation:
      process.env.RESERVATION_SERVICE_URL || "http://reservation-service:5002",
    payment: process.env.PAYMENT_SERVICE_URL || "http://payment-service:5004",
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "flight_booking_secret_key",
  },
};
