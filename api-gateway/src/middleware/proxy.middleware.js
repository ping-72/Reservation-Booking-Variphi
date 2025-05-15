const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/config");

/**
 * Create proxy middleware for a specific service
 * @param {string} serviceName - Name of the service (auth, ticket, reservation, payment)
 * @returns {function} Proxy middleware for the specified service
 */
const createServiceProxy = (serviceName) => {
  if (!config.services[serviceName]) {
    throw new Error(`Service "${serviceName}" not configured`);
  }

  return createProxyMiddleware({
    target: config.services[serviceName],
    changeOrigin: true,
    pathRewrite: {
      [`^/api/${serviceName}`]: "", // Rewrite path
    },
    logLevel: config.environment === "development" ? "debug" : "error",
    onProxyReq: (proxyReq, req, res) => {
      // Forward user info if available
      if (req.user) {
        proxyReq.setHeader("X-User-ID", req.user.userId);
        proxyReq.setHeader("X-User-Role", req.user.role);
      }
    },
    onError: (err, req, res) => {
      res.status(500).json({
        status: "error",
        message: `Error connecting to ${serviceName} service`,
        error: err.message,
      });
    },
  });
};

module.exports = {
  createServiceProxy,
};
