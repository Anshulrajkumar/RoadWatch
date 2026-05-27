"use strict";

const express = require("express");
const { getNearestRoad, getRoadByName } = require("../controllers/roadController");
const { validateLatLng, validateRoadName } = require("../middleware/validateQuery");

const router = express.Router();

router.get("/nearest", validateLatLng, getNearestRoad);
router.get("/search", validateRoadName, getRoadByName);

module.exports = router;
