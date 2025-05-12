/**
 * Error handling middleware
 */
exports.errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Check if error has status code
  const statusCode = err.statusCode || 500;

  // Default error message for 500 errors (don't expose details in production)
  const message = statusCode === 500 ? "Internal server error" : err.message;

  res.status(statusCode).json({
    message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
