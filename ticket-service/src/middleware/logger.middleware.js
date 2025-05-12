const logger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, body } = req;

  // Log request details
  console.log(`[${new Date().toISOString()}] ${method} ${originalUrl}`);
  if (Object.keys(body).length > 0) {
    console.log("Request Body:", JSON.stringify(body, null, 2));
  }

  // Capture the response
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] Response Time: ${duration}ms`);
    console.log("Response Status:", res.statusCode);
    if (body) {
      try {
        const responseBody = JSON.parse(body);
        console.log("Response Body:", JSON.stringify(responseBody, null, 2));
      } catch (e) {
        console.log("Response Body:", body);
      }
    }
    console.log("----------------------------------------");
    return originalSend.call(this, body);
  };

  next();
};

module.exports = logger;
