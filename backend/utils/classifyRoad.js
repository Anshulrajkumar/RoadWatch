"use strict";

const classifyRoad = (roadCode, roadName) => {
  const code = roadCode ? String(roadCode).toUpperCase() : "";
  const name = roadName ? String(roadName).toUpperCase() : "";
  const source = `${code} ${name}`.trim();

  if (source.includes("NATIONAL HIGHWAY") || code.startsWith("NH")) {
    return {
      type: "National Highway",
      authority: "NHAI",
      isNationalHighway: true,
    };
  }

  if (source.includes("STATE HIGHWAY") || code.startsWith("SH")) {
    return {
      type: "State Highway",
      authority: "State PWD",
      isNationalHighway: false,
    };
  }

  if (source.includes("MAJOR DISTRICT ROAD") || code.startsWith("MDR")) {
    return {
      type: "Major District Road",
      authority: "District PWD",
      isNationalHighway: false,
    };
  }

  return {
    type: "Unknown",
    authority: "Unknown",
    isNationalHighway: false,
  };
};

module.exports = { classifyRoad };
