const express = require("express");
const { createServiceProxy } = require("../middleware/proxy.middleware");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();
const ticketProxy = createServiceProxy("ticket");

// Public routes - no authentication required
router.get("/flights", ticketProxy);
router.get("/flights/:flightId", ticketProxy);

// Protected routes - authentication required
router.use(verifyToken);
router.use("/", ticketProxy);

module.exports = router;
