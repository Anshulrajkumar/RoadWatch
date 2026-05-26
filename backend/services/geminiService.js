"use strict";

const axios = require("axios");

const { getConfig } = require("../config");
const { createCache } = require("../utils/cache");
const { logger } = require("../utils/logger");

const config = getConfig();
const cache = createCache(config.cache.ttlMs, config.cache.maxEntries);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const toAbbr = (value) => {
  if (!value) return "NA";
  const letters = String(value).replace(/[^A-Za-z]/g, "");
  if (!letters) return "NA";
  return letters.slice(0, 3).toUpperCase();
};

const hashString = (value) => {
  let hash = 0;
  const input = String(value || "");
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const buildProjectId = (road) => {
  const code = road.roadCode || "RD";
  const district = toAbbr(road.district);
  return `RW-${code}-${district}`;
};

const inferTypeBand = (road) => {
  const type = String(road.type || "").toUpperCase();
  const code = String(road.roadCode || "").toUpperCase();

  if (type.includes("NATIONAL HIGHWAY") || code.startsWith("NH")) {
    return { min: 35, max: 120 };
  }
  if (type.includes("STATE HIGHWAY") || code.startsWith("SH")) {
    return { min: 15, max: 70 };
  }
  if (type.includes("MAJOR DISTRICT ROAD") || code.startsWith("MDR")) {
    return { min: 4, max: 25 };
  }

  return { min: 8, max: 45 };
};

const fallbackProject = (road, reason) => {
  const band = inferTypeBand(road);
  const seed = hashString(`${road.roadCode}-${road.district}-${road.state}`) % 1000;
  const factor = seed / 1000;
  const sanctioned = Number((band.min + (band.max - band.min) * factor).toFixed(1));
  const spent = Number((sanctioned * (0.6 + factor * 0.25)).toFixed(1));
  const completion = Math.round(clamp(60 + factor * 30, 40, 95));

  const project = {
    projectId: buildProjectId(road),
    contractor: "Government Empanelled Contractor",
    sanctionedBudgetCrore: sanctioned,
    spentBudgetCrore: spent,
    maintenanceStatus: completion >= 85 ? "Completed" : "In Progress",
    lastRelayingDate: "2023-10-01",
    riskLevel: completion >= 80 ? "Low" : "Medium",
    auditStatus: "Pending",
    completionPercentage: completion,
    summary: "AI enrichment unavailable. Showing baseline project estimates for dashboard use.",
    reason,
  };

  return project;
};

const buildPrompt = (road) => {
  const band = inferTypeBand(road);
  return (
    "You are an Indian road infrastructure analyst. Generate a realistic project JSON. " +
    "Return ONLY valid JSON without markdown or extra text.\n" +
    "Schema:\n" +
    "{\n" +
    "  \"projectId\": string,\n" +
    "  \"contractor\": string,\n" +
    "  \"sanctionedBudgetCrore\": number,\n" +
    "  \"spentBudgetCrore\": number,\n" +
    "  \"maintenanceStatus\": \"Planned\"|\"In Progress\"|\"Completed\"|\"Delayed\"|\"Needs Audit\",\n" +
    "  \"lastRelayingDate\": \"YYYY-MM-DD\",\n" +
    "  \"riskLevel\": \"Low\"|\"Medium\"|\"High\",\n" +
    "  \"auditStatus\": \"Verified\"|\"Pending\"|\"Flagged\",\n" +
    "  \"completionPercentage\": number,\n" +
    "  \"summary\": string\n" +
    "}\n" +
    "Constraints:\n" +
    `- sanctionedBudgetCrore between ${band.min} and ${band.max}.\n` +
    "- spentBudgetCrore <= sanctionedBudgetCrore.\n" +
    "- completionPercentage between 0 and 100.\n" +
    "- Use government-style, concise summary.\n" +
    "Context:\n" +
    JSON.stringify({
      roadCode: road.roadCode || null,
      roadName: road.roadName || null,
      district: road.district || null,
      state: road.state || null,
      type: road.type || null,
      authority: road.authority || null,
    })
  );
};

const extractJson = (text) => {
  if (!text) return null;
  const trimmed = String(text).trim();
  if (trimmed.startsWith("{")) return trimmed;
  const match = trimmed.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
};

const sanitizeProject = (data, road) => {
  const asString = (value) => (value ? String(value).trim() : null);
  const asNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const project = {
    projectId: asString(data.projectId) || buildProjectId(road),
    contractor: asString(data.contractor) || "Government Empanelled Contractor",
    sanctionedBudgetCrore: asNumber(data.sanctionedBudgetCrore),
    spentBudgetCrore: asNumber(data.spentBudgetCrore),
    maintenanceStatus: asString(data.maintenanceStatus) || "In Progress",
    lastRelayingDate: asString(data.lastRelayingDate) || "2023-10-01",
    riskLevel: asString(data.riskLevel) || "Medium",
    auditStatus: asString(data.auditStatus) || "Pending",
    completionPercentage: asNumber(data.completionPercentage),
    summary: asString(data.summary) || "Project metadata generated for dashboard visualization.",
  };

  const fallback = fallbackProject(road, "fallback-normalization");

  if (!Number.isFinite(project.sanctionedBudgetCrore)) {
    project.sanctionedBudgetCrore = fallback.sanctionedBudgetCrore;
  }
  if (!Number.isFinite(project.spentBudgetCrore)) {
    project.spentBudgetCrore = Math.min(project.sanctionedBudgetCrore, fallback.spentBudgetCrore);
  }
  if (!Number.isFinite(project.completionPercentage)) {
    project.completionPercentage = fallback.completionPercentage;
  }

  project.completionPercentage = clamp(project.completionPercentage, 0, 100);
  project.spentBudgetCrore = Math.min(project.spentBudgetCrore, project.sanctionedBudgetCrore);

  return project;
};

const getModelCandidates = () => {
  const list = [
    config.gemini.model,
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-1.0-pro",
  ];
  return [...new Set(list.filter(Boolean))];
};

const callGeminiModel = async (prompt, model) => {
  const url = `${config.gemini.baseUrl}/models/${model}:generateContent?key=${config.gemini.apiKey}`;

  for (let attempt = 0; attempt <= config.gemini.retry; attempt += 1) {
    try {
      return await axios.post(
        url,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            topP: 0.9,
            maxOutputTokens: 512,
          },
        },
        { timeout: config.gemini.timeoutMs }
      );
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        throw error;
      }
      const retryable = [429, 500, 502, 503, 504].includes(status);
      if (attempt >= config.gemini.retry || !retryable) {
        throw error;
      }
      const waitMs = config.gemini.retryDelayMs * (attempt + 1);
      logger.warn("Gemini request failed, retrying", { attempt: attempt + 1, waitMs });
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  return null;
};

const callGemini = async (prompt) => {
  let lastError = null;

  for (const model of getModelCandidates()) {
    try {
      return await callGeminiModel(prompt, model);
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status === 404) {
        logger.warn("Gemini model not found", { model });
        continue;
      }
      throw error;
    }
  }

  if (lastError) {
    throw lastError;
  }
  return null;
};

const generateProjectInsights = async (road) => {
  if (!road) {
    return { project: null, meta: { source: "none" } };
  }

  const cacheKey = `gemini:${road.roadCode || ""}:${road.district || ""}:${road.state || ""}:${road.type || ""}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return { project: cached.project, meta: { ...cached.meta, cache: "hit" } };
  }

  if (!config.gemini.apiKey) {
    const project = fallbackProject(road, "missing-api-key");
    const result = { project, meta: { source: "fallback", cache: "miss" } };
    cache.set(cacheKey, result);
    return result;
  }

  try {
    const prompt = buildPrompt(road);
    const response = await callGemini(prompt);
    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const json = extractJson(text);
    if (!json) {
      throw new Error("Gemini response missing JSON");
    }
    const parsed = JSON.parse(json);
    const project = sanitizeProject(parsed, road);
    const result = { project, meta: { source: "gemini", cache: "miss" } };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    logger.warn("Gemini enrichment failed", { message: error.message });
    const project = fallbackProject(road, "gemini-error");
    const result = { project, meta: { source: "fallback", cache: "miss" } };
    cache.set(cacheKey, result);
    return result;
  }
};

module.exports = { generateProjectInsights };
