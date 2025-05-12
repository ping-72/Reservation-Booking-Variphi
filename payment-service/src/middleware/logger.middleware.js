/**
 * Logger middleware
 * Logs incoming requests and outgoing responses
 */
module.exports = (req, res, next) => {
  const start = Date.now();
  const { method, url, body } = req;

  // Log the request
  console.log(`[${new Date().toISOString()}] ${method} ${url}`);

  if (Object.keys(body).length > 0) {
    console.log(`Request Body: ${JSON.stringify(body, null, 2)}`);
  }

  // Capture the original end method
  const originalEnd = res.end;

  // Override the end method to log the response
  res.end = function (chunk, encoding) {
    const responseTime = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] Response Time: ${responseTime}ms`
    );
    console.log(`Response Status: ${res.statusCode}`);

    // Try to log the response body if it's JSON
    if (res.get("Content-Type")?.includes("application/json") && chunk) {
      try {
        const body = chunk.toString("utf8");
        console.log(`Response Body: ${body}`);
      } catch (error) {
        console.log("Could not parse response body");
      }
    }

    console.log("----------------------------------------");

    // Call the original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};
