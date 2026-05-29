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
const { authMiddleware, optionalAuth } = require("./middleware/authMiddleware");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");
const { listComplaintsByUser } = require("./services/complaintStore");

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

// Protected endpoint: returns only the authenticated user's complaints
app.get("/api/my-complaints", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const complaintsData = await listComplaintsByUser(userId);
    const complaints = complaintsData
      .sort((a, b) => new Date(b.submittedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.createdAt).getTime());

    return res.json({
      success: true,
      total: complaints.length,
      userId,
      complaints,
    });
  } catch (error) {
    return next(error);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

const server = http.createServer(app);
server.setTimeout(config.requestTimeoutMs);

server.listen(config.port, () => {
  console.log(`RoadWatch backend listening on port ${config.port}`);
});
