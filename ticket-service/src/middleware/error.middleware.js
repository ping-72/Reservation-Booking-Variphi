exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === "production" ? {} : err,
  });
};
