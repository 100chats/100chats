const moment = require("moment");
// Handle GET requests to /api route
const logger = (req, res, next) => {
  console.log(
    `${req.method}: '${req.protocol}://${req.get("host")}${
      req.originalUrl
    }' at: '${moment().format()}' from ${
      req.ip ||
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.ip ||
      null
    }`
  );
  next();
};

const typeValidator = (type, value) => {
  if (typeof value !== type) {
    return false;
  }
  return true;
};

console.log(typeValidator("array", []), typeof []);
module.exports = { logger, typeValidator };
