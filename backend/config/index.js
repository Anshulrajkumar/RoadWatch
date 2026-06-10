"use strict";

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const config = {
  port: toInt(process.env.PORT, 4000),
  corsOrigin: "*",
  requestTimeoutMs: 120000,
  geocode: {
    url: "https://nominatim.openstreetmap.org/reverse",
    userAgent: "RoadWatch/1.0",
    timeoutMs: 12000,
    retry: 2,
    retryDelayMs: 800,
  },
  groq: {
    apiKey: process.env.GROQ_API || process.env.GROQ_API_KEY || "",
    model: "llama-3.1-8b-instant",
    baseUrl: "https://api.groq.com/openai/v1",
    timeoutMs: 12000,
    retry: 1,
    retryDelayMs: 800,
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "",
    model: "gemini-2.0-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    timeoutMs: 20000,
    retry: 1,
    retryDelayMs: 1000,
  },
  cache: {
    ttlMs: 300000,
    maxEntries: 1000,
  },
  rateLimit: {
    windowMs: 60000,
    max: 60,
  },
};

const getConfig = () => config;

module.exports = { getConfig };
