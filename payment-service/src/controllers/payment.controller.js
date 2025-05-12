const Payment = require("../models/payment.model");
const { razorpay, RAZORPAY_KEY_ID } = require("../config/razorpay");
const {
  getReservationById,
  updateReservationStatus,
  getTicketById,
} = require("../config/api-client");
const crypto = require("crypto");

/**
 * Create a payment order for a reservation
 */
exports.createPaymentOrder = async (req, res) => {
  try {
    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({ message: "Reservation ID is required" });
    }

    // Get the token for authentication with other services
    const token = req.headers.authorization.split(" ")[1];

    // Get reservation details
    const reservation = await getReservationById(reservationId, token);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Get ticket details to get the price
    const ticket = await getTicketById(reservation.ticketId, token);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Convert price to smallest currency unit (paise for INR)
    const amountInPaise = Math.round(parseFloat(ticket.price) * 100);

    // Create Razorpay order
    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `res_${reservationId.substring(0, 32)}`,
      notes: {
        reservationId: reservationId,
        userId: req.user.id,
        ticketId: reservation.ticketId,
        origin: ticket.origin,
        destination: ticket.destination,
        departureDate: ticket.departureDate,
      },
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Save payment record in database
    const payment = await Payment.create({
      userId: req.user.id,
      reservationId: reservationId,
      amount: ticket.price,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      status: "created",
      notes: `Payment for ${ticket.origin} to ${ticket.destination} on ${ticket.departureDate}`,
    });

    // Update reservation status to pending
    await updateReservationStatus(reservationId, "pending", token);

    // Return order details for frontend to initialize payment
    res.status(201).json({
      message: "Payment order created successfully",
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
      },
      order: {
        id: razorpayOrder.id,
        amount: parseFloat(ticket.price), // Original amount (not in paise)
        currency: razorpayOrder.currency,
        prefill: {
          name: reservation.passengerName,
          email: reservation.passengerEmail,
          contact: reservation.passengerPhone,
        },
        notes: {
          reservationId: reservationId,
          origin: ticket.origin,
          destination: ticket.destination,
          departureDate: ticket.departureDate,
        },
      },
      key_id: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({ message: "Error creating payment order" });
  }
};

/**
 * Verify and process payment after completion
 */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      reservationId,
    } = req.body;

    if (
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature ||
      !reservationId
    ) {
      return res
        .status(400)
        .json({ message: "Missing required payment verification details" });
    }

    // Get the token for authentication with other services
    const token = req.headers.authorization.split(" ")[1];

    // Create signature verification string
    const signatureString = `${razorpayOrderId}|${razorpayPaymentId}`;

    // Verify signature using Razorpay key secret
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET || "3FRwtRB9rP1sdoayb4fknITc"
      )
      .update(signatureString)
      .digest("hex");

    // Compare signatures
    const isSignatureValid = generatedSignature === razorpaySignature;

    if (!isSignatureValid) {
      // Update payment status to failed
      await Payment.update(
        {
          status: "failed",
          razorpayPaymentId,
          razorpaySignature,
          notes: "Payment signature verification failed",
        },
        { where: { razorpayOrderId } }
      );

      // Update reservation status to cancelled
      await updateReservationStatus(reservationId, "cancelled", token);

      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Get payment details from Razorpay
    const razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);

    // Update payment record
    await Payment.update(
      {
        razorpayPaymentId,
        razorpaySignature,
        status:
          razorpayPayment.status === "captured" ? "captured" : "authorized",
        notes: `Payment ${razorpayPayment.status} for reservation ${reservationId}`,
      },
      { where: { razorpayOrderId } }
    );

    // Update reservation status based on payment status
    const reservationStatus =
      razorpayPayment.status === "captured" ? "confirmed" : "pending";
    await updateReservationStatus(reservationId, reservationStatus, token);

    res.json({
      message: "Payment verification successful",
      status: razorpayPayment.status,
      reservationStatus,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};

/**
 * Get all payments for the current user
 */
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "User payments retrieved successfully",
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

/**
 * Get all payments (admin only)
 */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "All payments retrieved successfully",
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

/**
 * Get payment by ID
 */
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Check authorization - only admin or payment owner can access
    if (req.user.role !== "admin" && payment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this payment" });
    }

    res.json({
      message: "Payment retrieved successfully",
      payment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Error fetching payment" });
  }
};

/**
 * Get payments for a specific reservation
 */
exports.getPaymentsByReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    // Check authorization to view reservation payments
    const whereClause = { reservationId };
    if (req.user.role !== "admin") {
      whereClause.userId = req.user.id;
    }

    const payments = await Payment.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Reservation payments retrieved successfully",
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Error fetching reservation payments:", error);
    res.status(500).json({ message: "Error fetching payments" });
  }
};

/**
 * Confirm payment with payment method ID
 * This is a simplified version for the demo that doesn't use real payment processing
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;

    if (!orderId || !paymentMethodId) {
      return res
        .status(400)
        .json({ message: "Order ID and payment method ID are required" });
    }

    // Get the payment record
    const payment = await Payment.findOne({
      where: { razorpayOrderId: orderId },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment order not found" });
    }

    // Check authorization - only payment owner can confirm
    if (payment.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to confirm this payment" });
    }

    // Get the token for authentication with other services
    const token = req.headers.authorization.split(" ")[1];

    // Update payment status to captured
    await payment.update({
      status: "captured",
      razorpayPaymentId: paymentMethodId,
      notes:
        payment.notes + `\nPayment confirmed with method: ${paymentMethodId}`,
    });

    // Update reservation status to confirmed
    await updateReservationStatus(payment.reservationId, "confirmed", token);

    res.status(200).json({
      message: "Payment confirmed successfully",
      payment: {
        id: payment.id,
        userId: payment.userId,
        reservationId: payment.reservationId,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ message: "Error confirming payment" });
  }
};
