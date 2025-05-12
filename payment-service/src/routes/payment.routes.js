const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

// Protected routes - accessible to both admin and user
router.post(
  "/create-order",
  authenticate,
  authorize("admin", "user"),
  paymentController.createPaymentOrder
);

router.post(
  "/confirm",
  authenticate,
  authorize("admin", "user"),
  paymentController.confirmPayment
);

router.post(
  "/verify",
  authenticate,
  authorize("admin", "user"),
  paymentController.verifyPayment
);

router.get(
  "/my-payments",
  authenticate,
  authorize("admin", "user"),
  paymentController.getUserPayments
);

router.get(
  "/reservation/:reservationId",
  authenticate,
  authorize("admin", "user"),
  paymentController.getPaymentsByReservation
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "user"),
  paymentController.getPaymentById
);

// Admin-only routes
router.get(
  "/admin/all",
  authenticate,
  authorize("admin"),
  paymentController.getAllPayments
);

module.exports = router;
