"use strict";

const { reverseGeocode, searchRoadByName } = require("../services/geocodeService");
const { extractRoad, normalizeRoadCode } = require("../utils/extractRoad");
const { generateProjectInsights } = require("../services/geminiService");

const getNearestRoad = async (req, res, next) => {
  try {
    const lat = Number.parseFloat(req.query.lat);
    const lng = Number.parseFloat(req.query.lng);

    const result = await reverseGeocode(lat, lng);
    const roadInfo = extractRoad(result.data);

    const hasRoad = Boolean(roadInfo.roadCode || roadInfo.roadName || roadInfo.displayName);

    if (!hasRoad) {
      return res.status(200).json({
        success: false,
        message: "No road information found for the provided coordinates.",
        coordinates: { lat, lng },
        road: roadInfo,
      });
    }

    const projectResult = await generateProjectInsights(roadInfo);

    return res.json({
      success: true,
      coordinates: { lat, lng },
      road: roadInfo,
      project: projectResult.project,
    });
  } catch (error) {
    return next(error);
  }
};

const getRoadByName = async (req, res, next) => {
  try {
    const roadName = String(req.query.roadName || "").trim();
    const userLat = Number.parseFloat(req.query.lat);
    const userLng = Number.parseFloat(req.query.lng);
    const userCoords =
      Number.isFinite(userLat) && Number.isFinite(userLng) ? { lat: userLat, lng: userLng } : null;

    const result = await searchRoadByName(roadName, userCoords);
    if (!result.data) {
      return res.status(200).json({
        success: false,
        message: "No matching road found for the provided name.",
        query: { roadName, userCoordinates: userCoords },
      });
    }

    const roadInfo = extractRoad(result.data);
    const queryRoadCode = normalizeRoadCode(roadName);
    if (!roadInfo.roadCode && queryRoadCode) {
      roadInfo.roadCode = queryRoadCode;
    }
    const lat = Number.parseFloat(result.data.lat);
    const lng = Number.parseFloat(result.data.lon);
    const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lng);
    const hasRoad = Boolean(roadInfo.roadCode || roadInfo.roadName || roadInfo.displayName);

    if (!hasRoad) {
      return res.status(200).json({
        success: false,
        message: "No road information found for the provided name.",
        query: { roadName, userCoordinates: userCoords },
        coordinates: hasCoordinates ? { lat, lng } : null,
        road: roadInfo,
      });
    }

    const projectResult = await generateProjectInsights(roadInfo);

    return res.json({
      success: true,
      query: { roadName, userCoordinates: userCoords },
      coordinates: hasCoordinates ? { lat, lng } : null,
      road: roadInfo,
      project: projectResult.project,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getNearestRoad, getRoadByName };
