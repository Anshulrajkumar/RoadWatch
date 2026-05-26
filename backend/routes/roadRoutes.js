"use strict";

const express = require("express");
const { getNearestRoad } = require("../controllers/roadController");
const { validateLatLng } = require("../middleware/validateQuery");

const router = express.Router();

router.get("/nearest", validateLatLng, getNearestRoad);

module.exports = router;
