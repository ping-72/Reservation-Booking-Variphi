const express = require("express");
const { createServiceProxy } = require("../middleware/proxy.middleware");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();
const paymentProxy = createServiceProxy("payment");

// All payment routes require authentication
router.use(verifyToken);
router.use("/", paymentProxy);

module.exports = router;
