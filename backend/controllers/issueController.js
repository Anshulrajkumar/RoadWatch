"use strict";

const { reverseGeocode } = require("../services/geocodeService");
const { extractRoad, normalizeRoadCode } = require("../utils/extractRoad");
const { classifyRoad } = require("../utils/classifyRoad");
const { generateIssueInsights, rewriteIssueDescription } = require("../services/geminiService");
const { createComplaint, listComplaints } = require("../services/complaintStore");

const getBodyValue = (body, ...keys) => {
  for (const key of keys) {
    if (body[key] !== undefined && body[key] !== null && String(body[key]).trim() !== "") {
      return body[key];
    }
  }
  return null;
};

const buildRoadFromBody = (body) => {
  const roadCode = normalizeRoadCode(getBodyValue(body, "roadCode", "road_code"));
  const roadName = getBodyValue(body, "roadName", "road_name");

  return {
    roadCode: roadCode || null,
    roadName: roadName ? String(roadName).trim() : null,
    displayName: getBodyValue(body, "displayName", "display_name"),
    district: getBodyValue(body, "district"),
    state: getBodyValue(body, "state"),
    locality: getBodyValue(body, "locality"),
    type: getBodyValue(body, "roadType", "road_type", "type"),
    authority: getBodyValue(body, "authority"),
    confidence: Number(getBodyValue(body, "confidence")) || null,
  };
};

const needsRoadEnrichment = (road) => {
  return !road.roadCode && !road.roadName && !road.displayName;
};

const normalizeRoad = (road) => {
  const normalized = { ...road };
  if (normalized.roadCode) {
    normalized.roadCode = normalizeRoadCode(normalized.roadCode);
  }

  const classification = classifyRoad(normalized.roadCode, normalized.roadName || normalized.displayName);
  if (!normalized.type || normalized.type === "Unknown") {
    normalized.type = classification.type;
  }
  if (!normalized.authority || normalized.authority === "Unknown") {
    normalized.authority = classification.authority;
  }

  return normalized;
};

const reportIssue = async (req, res, next) => {
  try {
    const issueType = String(getBodyValue(req.body, "issueType", "issue_type") || "").trim();
    const description = String(getBodyValue(req.body, "description") || "").trim();
    const userId = getBodyValue(req.body, "userId", "user_id", "citizenId", "citizen_id");
    const lat = Number.parseFloat(getBodyValue(req.body, "latitude", "lat"));
    const lng = Number.parseFloat(getBodyValue(req.body, "longitude", "lng"));

    if (!issueType) {
      return res.status(400).json({
        success: false,
        message: "Issue type is required.",
      });
    }

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({
        success: false,
        message: "Valid latitude and longitude are required.",
      });
    }

    const imageFile = req.files?.image?.[0] || null;
    const videoFile = req.files?.video?.[0] || null;

    if (!imageFile && !videoFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image or video file.",
      });
    }

    let road = buildRoadFromBody(req.body);

    if (needsRoadEnrichment(road)) {
      const geocodeResult = await reverseGeocode(lat, lng);
      road = extractRoad(geocodeResult.data || {});
    }

    road = normalizeRoad(road);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = imageFile ? `${baseUrl}/uploads/issues/${imageFile.filename}` : null;
    const videoUrl = videoFile ? `${baseUrl}/uploads/issues/${videoFile.filename}` : null;

    const aiResult = await generateIssueInsights({
      issueType,
      description,
      road,
      coordinates: { lat, lng },
    });

    const complaint = createComplaint({
      userId,
      roadCode: road.roadCode,
      roadName: road.roadName,
      roadType: road.type,
      authority: road.authority,
      district: road.district,
      state: road.state,
      lat,
      lng,
      issueType,
      description,
      summary: aiResult.summary,
      severity: aiResult.severity,
      priority: aiResult.priority,
      riskScore: aiResult.riskScore,
      mediaUrl: imageUrl || videoUrl,
      media: {
        imageUrl,
        videoUrl,
      },
      status: "Submitted",
    });

    return res.status(201).json({
      success: true,
      complaint,
      road,
      ai: aiResult,
      media: {
        imageUrl,
        videoUrl,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const rewriteDescription = async (req, res, next) => {
  try {
    const description = String(getBodyValue(req.body, "description") || "").trim();
    const issueType = String(getBodyValue(req.body, "issueType", "issue_type") || "").trim();

    if (!description) {
      return res.status(400).json({
        success: false,
        message: "Description is required.",
      });
    }

    const result = await rewriteIssueDescription({ issueType, description });

    return res.json({
      success: true,
      description: result.description,
      meta: result.meta,
    });
  } catch (error) {
    return next(error);
  }
};

const listComplaintHistory = async (req, res, next) => {
  try {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null;

    const all = listComplaints().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const complaints = limit ? all.slice(0, limit) : all;

    return res.json({
      success: true,
      total: all.length,
      complaints,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { reportIssue, rewriteDescription, listComplaintHistory };
