const jwt = require("jsonwebtoken");
const { JWT_PASSWORD } = require("../../config/config.js");

function authMiddleware(ws, req, next) {
  try {
    let tokenHeader;

    if (req.headers["authorization"]) {
      tokenHeader = req.headers["authorization"];
    } else {
      const url = new URL(req.url, `http://${req.headers.host}`);
      tokenHeader = url.searchParams.get("token");
    }

    if (!tokenHeader) {
      ws.close(4001, "Authorization token is missing.");
      return;
    }

    const token = tokenHeader.startsWith("Bearer ")
      ? tokenHeader.split(" ")[1]
      : tokenHeader;

    const decoded = jwt.verify(token, JWT_PASSWORD);

    if (decoded.username) {
      ws.username = decoded.username;
      next();
    } else {
      ws.close(4003, "Access denied.");
    }
  } catch (error) {
    console.error("Auth error:", error);
    ws.close(4001, "Invalid or expired token.");
  }
}

module.exports = authMiddleware;
