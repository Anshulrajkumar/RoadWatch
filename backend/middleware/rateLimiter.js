"use strict";

const rateLimit = require("express-rate-limit");
const { getConfig } = require("../config");

const config = getConfig();

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

module.exports = limiter;
