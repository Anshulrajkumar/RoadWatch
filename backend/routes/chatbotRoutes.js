"use strict";

const express = require("express");
const router = express.Router();
const { getChatbotResponse } = require("../services/chatbotService");

/**
 * POST /api/chatbot/message
 * Send a message to the RoadWatch AI assistant.
 */
router.post("/message", async (req, res) => {
  try {
    const { message, history, currentPage } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: "Message too long (max 1000 characters)" });
    }

    const reply = await getChatbotResponse(
      message.trim(),
      Array.isArray(history) ? history : [],
      currentPage || "/"
    );

    return res.json({ reply });
  } catch (error) {
    console.error("[ChatbotRoute] Error:", error.message);
    return res.status(500).json({
      error: "Failed to get chatbot response",
      reply: "Sorry, I'm having trouble right now. Please try again.",
    });
  }
});

module.exports = router;
