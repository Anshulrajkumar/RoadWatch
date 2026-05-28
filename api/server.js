"use strict";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", "backend", ".env") });

const express = require("express");
const cors = require("cors");

const roadRoutes = require("../backend/routes/roadRoutes");
const issueRoutes = require("../backend/routes/issueRoutes");
const complaintRoutes = require("../backend/routes/complaintRoutes");
const chatbotRoutes = require("../backend/routes/chatbotRoutes");

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "RoadWatch backend (Vercel)" });
});

app.use("/api/road", roadRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, _next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
