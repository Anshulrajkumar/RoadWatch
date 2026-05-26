"use strict";

const { logger } = require("../utils/logger");

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
};

const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  logger.error("Unhandled error", { status, message: err.message });

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: err.code || "INTERNAL_ERROR",
  });
};

module.exports = { notFoundHandler, errorHandler };
