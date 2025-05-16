const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/config");

/**
 * Create proxy middleware for a specific service
 * @param {string} serviceName - Name of the service (auth, ticket, reservation, payment)
 * @param {object} options - Additional options for the proxy
 * @returns {function} Proxy middleware for the specified service
 */
const createServiceProxy = (serviceName, options = {}) => {
  if (!config.services[serviceName]) {
    throw new Error(`Service "${serviceName}" not configured`);
  }

  console.log(
    `Creating proxy for ${serviceName} service at ${config.services[serviceName]}`
  );

  // Default path rewrite rule
  const defaultPathRewrite = {
    [`^/api/${serviceName}`]: "", // Rewrite path
  };

  // Merge default options with provided options
  const proxyOptions = {
    target: config.services[serviceName],
    changeOrigin: true,
    pathRewrite: options.pathRewrite || defaultPathRewrite,
    logLevel: config.environment === "development" ? "debug" : "error",
    onProxyReq: (proxyReq, req, res) => {
      // Forward user info if available
      if (req.user) {
        proxyReq.setHeader("X-User-ID", req.user.userId);
        proxyReq.setHeader("X-User-Role", req.user.role);
      }

      // Log the request details in development mode
      if (config.environment === "development") {
        const targetPath = req.url.replace(
          new RegExp(`^/api/${serviceName}`),
          options.pathRewrite ? Object.values(options.pathRewrite)[0] : ""
        );
        console.log(
          `Proxying ${req.method} ${req.originalUrl} -> ${config.services[serviceName]}${targetPath}`
        );
      }

      // If there's a request body, we need to rewrite it for the proxy
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        // Update content-length
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        // Write body data
        proxyReq.write(bodyData);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      // Log the response in development mode
      if (config.environment === "development") {
        console.log(
          `Response from ${serviceName} service: ${proxyRes.statusCode}`
        );
      }
    },
    onError: (err, req, res) => {
      console.error(`Proxy error for ${serviceName} service:`, err);
      res.status(500).json({
        status: "error",
        message: `Error connecting to ${serviceName} service`,
        error: err.message,
      });
    },
  };

  return createProxyMiddleware(proxyOptions);
};

module.exports = {
  createServiceProxy,
};
