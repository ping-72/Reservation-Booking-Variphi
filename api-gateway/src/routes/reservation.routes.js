const express = require("express");
const { createServiceProxy } = require("../middleware/proxy.middleware");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();
const reservationProxy = createServiceProxy("reservation");

// All reservation routes require authentication
router.use(verifyToken);
router.use("/", reservationProxy);

module.exports = router;
