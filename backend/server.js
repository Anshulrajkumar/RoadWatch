"use strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const http = require("http");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { getConfig } = require("./config");
const roadRoutes = require("./routes/roadRoutes");
const issueRoutes = require("./routes/issueRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const rateLimiter = require("./middleware/rateLimiter");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const config = getConfig();
const app = express();

// Core middleware stack for API safety and observability.
app.use(
  cors({
    origin: config.corsOrigin === "*" ? true : config.corsOrigin,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined"));
app.use(rateLimiter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "RoadWatch backend" });
});

app.use("/api/road", roadRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
server.setTimeout(config.requestTimeoutMs);

server.listen(config.port, () => {
  console.log(`RoadWatch backend listening on port ${config.port}`);
});
