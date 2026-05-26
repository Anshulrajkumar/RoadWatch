"use strict";

const { classifyRoad } = require("./classifyRoad");

const ROAD_CODE_REGEX = /\b(NH|SH|MDR)\s*-?\s*([0-9A-Z]+)\b/i;

const normalizeRoadCode = (value) => {
  if (!value) return null;
  const match = String(value).match(ROAD_CODE_REGEX);
  if (!match) return null;
  const prefix = match[1].toUpperCase();
  const suffix = match[2].replace(/\s+/g, "").toUpperCase();
  return `${prefix}${suffix}`;
};

const normalizeRoadName = (value) => {
  if (!value) return null;
  let name = String(value).trim();
  name = name.replace(/National Highway/gi, "NH");
  name = name.replace(/State Highway/gi, "SH");
  name = name.replace(/\s+/g, " ");
  return name;
};

const getDisplaySegment = (displayName) => {
  if (!displayName) return null;
  const first = String(displayName).split(",")[0].trim();
  return first || null;
};

const normalizeCodeLike = (value) => String(value || "").replace(/[\s-]/g, "").toUpperCase();

const getLocality = (address) => {
  if (!address) return null;
  return (
    address.city ||
    address.town ||
    address.village ||
    address.suburb ||
    address.hamlet ||
    address.neighbourhood ||
    null
  );
};

const getDistrict = (address) => {
  if (!address) return null;
  return address.county || address.district || address.state_district || null;
};

const computeConfidence = ({ roadCode, roadName, displayName, district, state }) => {
  let score = 0;
  if (roadCode) score += 0.5;
  if (roadName) score += 0.25;
  if (displayName) score += 0.15;
  if (district || state) score += 0.1;
  return Number(Math.min(1, score).toFixed(3));
};

const extractRoad = (nominatimData) => {
  const address = nominatimData && nominatimData.address ? nominatimData.address : {};
  const displayName = nominatimData && nominatimData.display_name ? nominatimData.display_name : null;
  const nameDetails = nominatimData && nominatimData.namedetails ? nominatimData.namedetails : {};

  const candidateRoadName =
    address.road ||
    address.highway ||
    nameDetails.name ||
    nameDetails["name:en"] ||
    getDisplaySegment(displayName) ||
    null;

  const roadName = normalizeRoadName(candidateRoadName);
  let roadCode = normalizeRoadCode(roadName) || normalizeRoadCode(displayName);

  if (!roadCode && roadName) {
    roadCode = normalizeRoadCode(roadName);
  }

  let finalRoadName = roadName;
  if (roadCode && normalizeCodeLike(roadName) === roadCode) {
    const displaySegment = getDisplaySegment(displayName);
    if (displaySegment && normalizeCodeLike(displaySegment) !== roadCode) {
      finalRoadName = displaySegment;
    }
  }

  if (!finalRoadName && roadCode) {
    finalRoadName = roadCode;
  }

  const locality = getLocality(address);
  const district = getDistrict(address);
  const state = address.state || null;

  const classification = classifyRoad(roadCode, finalRoadName);

  return {
    roadCode,
    roadName: finalRoadName,
    displayName,
    locality,
    district,
    state,
    type: classification.type,
    authority: classification.authority,
    isNationalHighway: classification.isNationalHighway,
    confidence: computeConfidence({
      roadCode,
      roadName: finalRoadName,
      displayName,
      district,
      state,
    }),
  };
};

module.exports = { extractRoad, normalizeRoadCode, normalizeRoadName };
