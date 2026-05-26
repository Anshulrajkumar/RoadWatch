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

module.exports = { validateLatLng };
