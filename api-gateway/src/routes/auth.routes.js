const express = require("express");
const { createServiceProxy } = require("../middleware/proxy.middleware");

const router = express.Router();
const authProxy = createServiceProxy("auth");

// All requests to /api/auth/* are proxied to the auth service
router.use("/", authProxy);

module.exports = router;
