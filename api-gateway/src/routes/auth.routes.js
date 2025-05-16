const express = require("express");
const { createServiceProxy } = require("../middleware/proxy.middleware");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/config");

const router = express.Router();

// Define auth service URL
const authService = config.services.auth;

// Login endpoint
router.post(
  "/login",
  createProxyMiddleware({
    target: authService,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth/login": "/api/auth/login",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`Proxying login request to ${authService}/api/auth/login`);
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`Login response: ${proxyRes.statusCode}`);
    },
  })
);

// Registration endpoint
router.post(
  "/register",
  createProxyMiddleware({
    target: authService,
    changeOrigin: true,
    pathRewrite: {
      "^/api/auth/register": "/api/auth/register",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `Proxying register request to ${authService}/api/auth/register`
      );
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`Register response: ${proxyRes.statusCode}`);
    },
  })
);

// Default fallback for other auth routes
const authProxy = createServiceProxy("auth", {
  pathRewrite: {
    "^/api/auth": "/api/auth",
  },
});

// All requests to /api/auth/* are proxied to the auth service
router.use("/", authProxy);

module.exports = router;
