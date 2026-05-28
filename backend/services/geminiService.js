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
    config.groq.model,
    "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile",
    "llama3-8b-8192",
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ];
  return [...new Set(list.filter(Boolean))];
};

const callGroqModel = async (prompt, model) => {
  const url = `${config.groq.baseUrl}/chat/completions`;

  for (let attempt = 0; attempt <= config.groq.retry; attempt += 1) {
    try {
      return await axios.post(
        url,
        {
          model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.4,
          top_p: 0.9,
          max_tokens: 512,
        },
        {
          timeout: config.groq.timeoutMs,
          headers: {
            Authorization: `Bearer ${config.groq.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      const status = error?.response?.status;
      if (status === 404) {
        throw error;
      }
      const retryable = [429, 500, 502, 503, 504].includes(status);
      if (attempt >= config.groq.retry || !retryable) {
        throw error;
      }
      const waitMs = config.groq.retryDelayMs * (attempt + 1);
      logger.warn("Groq request failed, retrying", { attempt: attempt + 1, waitMs });
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  return null;
};

const callGroq = async (prompt) => {
  let lastError = null;

  for (const model of getModelCandidates()) {
    try {
      return await callGroqModel(prompt, model);
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status === 404) {
        logger.warn("Groq model not found", { model });
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

  const cacheKey = `groq:${road.roadCode || ""}:${road.district || ""}:${road.state || ""}:${road.type || ""}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return { project: cached.project, meta: { ...cached.meta, cache: "hit" } };
  }

  if (!config.groq.apiKey) {
    const project = fallbackProject(road, "missing-api-key");
    const result = { project, meta: { source: "fallback", cache: "miss" } };
    cache.set(cacheKey, result);
    return result;
  }

  try {
    const prompt = buildPrompt(road);
    const response = await callGroq(prompt);
    const text = response?.data?.choices?.[0]?.message?.content;
    const json = extractJson(text);
    if (!json) {
      throw new Error("Groq response missing JSON");
    }
    const parsed = JSON.parse(json);
    const project = sanitizeProject(parsed, road);
    const result = { project, meta: { source: "groq", cache: "miss" } };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    logger.warn("Groq enrichment failed", { message: error.message });
    const project = fallbackProject(road, "groq-error");
    const result = { project, meta: { source: "fallback", cache: "miss" } };
    cache.set(cacheKey, result);
    return result;
  }
};

const issueDefaults = {
  Pothole: { severity: "High", priority: "Immediate", riskScore: 84, dangerLevel: "High", impact: "Severe" },
  Crack: { severity: "Medium", priority: "Priority", riskScore: 58, dangerLevel: "Medium", impact: "Moderate" },
  Waterlogging: { severity: "Medium", priority: "Priority", riskScore: 62, dangerLevel: "Medium", impact: "Moderate" },
  "Broken Divider": { severity: "High", priority: "Immediate", riskScore: 78, dangerLevel: "High", impact: "Severe" },
  "Faded Markings": { severity: "Low", priority: "Routine", riskScore: 32, dangerLevel: "Low", impact: "Minor" },
  "Road Collapse": { severity: "Critical", priority: "Immediate", riskScore: 92, dangerLevel: "High", impact: "Severe" },
  "Drainage Issue": { severity: "Medium", priority: "Priority", riskScore: 55, dangerLevel: "Medium", impact: "Moderate" },
  Other: { severity: "Medium", priority: "Priority", riskScore: 50, dangerLevel: "Medium", impact: "Moderate" },
};

const getIssueBaseline = (issueType) => {
  const normalized = String(issueType || "Other").trim();
  return issueDefaults[normalized] || issueDefaults.Other;
};

const buildIssuePrompt = ({ issueType, description, road, coordinates }) => {
  return (
    "You are an Indian road safety analyst. Generate realistic issue severity JSON. " +
    "Return ONLY valid JSON without markdown or extra text.\n" +
    "Schema:\n" +
    "{\n" +
    "  \"severity\": \"Low\"|\"Medium\"|\"High\"|\"Critical\",\n" +
    "  \"priority\": \"Routine\"|\"Priority\"|\"Immediate\",\n" +
    "  \"dangerLevel\": \"Low\"|\"Medium\"|\"High\",\n" +
    "  \"impact\": \"Minor\"|\"Moderate\"|\"Severe\",\n" +
    "  \"riskScore\": number,\n" +
    "  \"summary\": string\n" +
    "}\n" +
    "Constraints:\n" +
    "- riskScore between 0 and 100.\n" +
    "- summary must be concise and official.\n" +
    "Context:\n" +
    JSON.stringify({
      issueType: issueType || null,
      description: description || null,
      roadCode: road?.roadCode || null,
      roadName: road?.roadName || null,
      roadType: road?.type || null,
      authority: road?.authority || null,
      district: road?.district || null,
      state: road?.state || null,
      coordinates: coordinates || null,
    })
  );
};

const buildRewritePrompt = ({ issueType, description }) => {
  return (
    "You are a civic complaint editor. Rewrite the user's description into a clear, concise report for municipal engineers. " +
    "Keep the meaning, do not add new facts, and do not mention that it was rewritten. " +
    "Return ONLY the rewritten description, no quotes, no markdown.\n" +
    "Guidelines:\n" +
    "- 1 to 3 sentences.\n" +
    "- Use formal Indian English.\n" +
    "- Keep length under 300 characters.\n" +
    "Context:\n" +
    JSON.stringify({
      issueType: issueType || null,
      description: description || null,
    })
  );
};

const fallbackIssueInsights = (payload, reason) => {
  const base = getIssueBaseline(payload.issueType);
  return {
    severity: base.severity,
    priority: base.priority,
    dangerLevel: base.dangerLevel,
    impact: base.impact,
    riskScore: base.riskScore,
    summary:
      payload.description?.slice(0, 140) ||
      `Reported ${payload.issueType || "road issue"} requires assessment.`,
    meta: { source: "fallback", reason },
  };
};

const sanitizeIssueInsights = (data, payload) => {
  const asString = (value) => (value ? String(value).trim() : null);
  const asNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };
  const fallback = fallbackIssueInsights(payload, "fallback-normalization");

  const result = {
    severity: asString(data.severity) || fallback.severity,
    priority: asString(data.priority) || fallback.priority,
    dangerLevel: asString(data.dangerLevel) || fallback.dangerLevel,
    impact: asString(data.impact) || fallback.impact,
    riskScore: asNumber(data.riskScore),
    summary: asString(data.summary) || fallback.summary,
    meta: { source: "groq" },
  };

  if (!Number.isFinite(result.riskScore)) {
    result.riskScore = fallback.riskScore;
  }

  result.riskScore = clamp(result.riskScore, 0, 100);
  return result;
};

const generateIssueInsights = async (payload) => {
  if (!payload) {
    return fallbackIssueInsights({ issueType: "Other" }, "missing-payload");
  }

  const cacheKey = `issue:${payload.issueType || ""}:${payload.road?.roadCode || ""}:${payload.road?.district || ""}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, meta: { ...cached.meta, cache: "hit" } };
  }

  if (!config.groq.apiKey) {
    const fallback = fallbackIssueInsights(payload, "missing-api-key");
    const result = { ...fallback, meta: { ...fallback.meta, cache: "miss" } };
    cache.set(cacheKey, result);
    return result;
  }

  try {
    const prompt = buildIssuePrompt(payload);
    const response = await callGroq(prompt);
    const text = response?.data?.choices?.[0]?.message?.content;
    const json = extractJson(text);
    if (!json) {
      throw new Error("Groq response missing JSON");
    }
    const parsed = JSON.parse(json);
    const result = sanitizeIssueInsights(parsed, payload);
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    logger.warn("Groq issue insights failed", { message: error.message });
    const fallback = fallbackIssueInsights(payload, "groq-error");
    const result = { ...fallback, meta: { ...fallback.meta, cache: "miss" } };
    cache.set(cacheKey, result);
    return result;
  }
};

const sanitizeRewrite = (text, fallback) => {
  if (!text) return fallback;
  const cleaned = String(text).trim().replace(/^"|"$/g, "");
  if (!cleaned) return fallback;
  return cleaned.length > 320 ? cleaned.slice(0, 320).trim() : cleaned;
};

const rewriteIssueDescription = async ({ issueType, description }) => {
  const trimmed = String(description || "").trim();
  if (!trimmed) {
    return { description: "", meta: { source: "none" } };
  }

  const cacheKey = `rewrite:${issueType || ""}:${hashString(trimmed)}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return { ...cached, meta: { ...cached.meta, cache: "hit" } };
  }

  if (!config.groq.apiKey) {
    const result = {
      description: trimmed,
      meta: { source: "fallback", reason: "missing-api-key", cache: "miss" },
    };
    cache.set(cacheKey, result);
    return result;
  }

  try {
    const prompt = buildRewritePrompt({ issueType, description: trimmed });
    const response = await callGroq(prompt);
    const text = response?.data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("Groq response missing description");
    }
    const rewritten = sanitizeRewrite(text, trimmed);
    const result = { description: rewritten, meta: { source: "groq", cache: "miss" } };
    cache.set(cacheKey, result);
    return result;
  } catch (error) {
    logger.warn("Groq rewrite failed", { message: error.message });
    const result = {
      description: trimmed,
      meta: { source: "fallback", reason: "groq-error", cache: "miss" },
    };
    cache.set(cacheKey, result);
    return result;
  }
};

module.exports = { generateProjectInsights, generateIssueInsights, rewriteIssueDescription };
