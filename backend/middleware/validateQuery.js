"use strict";

const validateLatLng = (req, res, next) => {
  const lat = Number.parseFloat(req.query.lat);
  const lng = Number.parseFloat(req.query.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({
      success: false,
      message: "Invalid latitude or longitude.",
    });
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({
      success: false,
      message: "Latitude or longitude out of range.",
    });
  }

  return next();
};

const validateRoadName = (req, res, next) => {
  const roadName = String(req.query.roadName || "").trim();
  const lat = req.query.lat;
  const lng = req.query.lng;

  if (!roadName) {
    return res.status(400).json({
      success: false,
      message: "roadName query parameter is required.",
    });
  }

  if (roadName.length < 2) {
    return res.status(400).json({
      success: false,
      message: "roadName must be at least 2 characters long.",
    });
  }

  const hasLat = lat !== undefined;
  const hasLng = lng !== undefined;

  if (hasLat !== hasLng) {
    return res.status(400).json({
      success: false,
      message: "lat and lng must be provided together for proximity search.",
    });
  }

  if (hasLat && hasLng) {
    const parsedLat = Number.parseFloat(lat);
    const parsedLng = Number.parseFloat(lng);

    if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude.",
      });
    }

    if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      return res.status(400).json({
        success: false,
        message: "Latitude or longitude out of range.",
      });
    }
  }

  return next();
};

module.exports = { validateLatLng, validateRoadName };
