"use strict";

const { reverseGeocode } = require("../services/geocodeService");
const { extractRoad } = require("../utils/extractRoad");
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

module.exports = { getNearestRoad };
