const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

// Protected routes - accessible to both admin and user
router.post(
  "/",
  authenticate,
  authorize("admin", "user"),
  reservationController.createReservation
);
router.get(
  "/",
  authenticate,
  authorize("admin", "user"),
  reservationController.getReservations
);
router.get(
  "/my-reservations",
  authenticate,
  authorize("admin", "user"),
  reservationController.getUserReservations
);
router.get(
  "/ticket/:ticketId",
  authenticate,
  authorize("admin", "user"),
  reservationController.getReservationsByTicket
);
router.get(
  "/:id",
  authenticate,
  authorize("admin", "user"),
  reservationController.getReservationById
);
router.put(
  "/:id",
  authenticate,
  authorize("admin", "user"),
  reservationController.updateReservation
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin", "user"),
  reservationController.deleteReservation
);

// Admin-only routes
router.get(
  "/admin/all",
  authenticate,
  authorize("admin"),
  reservationController.getAllReservations
);

module.exports = router;
