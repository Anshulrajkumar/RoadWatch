"use strict";

const axios = require("axios");

const { getConfig } = require("../config");
const { createCache } = require("../utils/cache");
const { logger } = require("../utils/logger");

const config = getConfig();
const cache = createCache(config.cache.ttlMs, config.cache.maxEntries);

const isRetryable = (error) => {
  if (!error || !error.response) return true;
  const status = error.response.status;
  return [429, 500, 502, 503, 504].includes(status);
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getRetryDelay = (error, attempt) => {
  const retryAfter = Number(error?.response?.headers?.["retry-after"]);
  if (Number.isFinite(retryAfter) && retryAfter > 0) {
    return retryAfter * 1000;
  }
  return config.geocode.retryDelayMs * (attempt + 1);
};

const requestReverseGeocode = async (lat, lng) => {
  for (let attempt = 0; attempt <= config.geocode.retry; attempt += 1) {
    try {
      return await axios.get(config.geocode.url, {
        params: {
          format: "jsonv2",
          lat,
          lon: lng,
          addressdetails: 1,
          namedetails: 1,
        },
        timeout: config.geocode.timeoutMs,
        headers: {
          "User-Agent": config.geocode.userAgent,
          Accept: "application/json",
        },
      });
    } catch (error) {
      if (attempt >= config.geocode.retry || !isRetryable(error)) {
        throw error;
      }
      const waitMs = getRetryDelay(error, attempt);
      logger.warn("Nominatim request failed, retrying", {
        attempt: attempt + 1,
        waitMs,
      });
      await delay(waitMs);
    }
  }
  return null;
};

const toRad = (value) => (value * Math.PI) / 180;

const getDistanceKm = (from, to) => {
  const earthRadiusKm = 6371;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
};

const pickNearestResult = (results, userCoords) => {
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  if (!userCoords || !Number.isFinite(userCoords.lat) || !Number.isFinite(userCoords.lng)) {
    return results[0] || null;
  }

  let nearest = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const item of results) {
    const lat = Number.parseFloat(item?.lat);
    const lng = Number.parseFloat(item?.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      continue;
    }

    const distanceKm = getDistanceKm(userCoords, { lat, lng });
    if (distanceKm < bestDistance) {
      bestDistance = distanceKm;
      nearest = item;
    }
  }

  return nearest || results[0] || null;
};

const requestRoadNameSearch = async (roadName) => {
  const searchUrl = config.geocode.searchUrl || config.geocode.url.replace(/\/reverse$/, "/search");

  for (let attempt = 0; attempt <= config.geocode.retry; attempt += 1) {
    try {
      return await axios.get(searchUrl, {
        params: {
          format: "jsonv2",
          q: roadName,
          countrycodes: "in",
          addressdetails: 1,
          namedetails: 1,
          limit: 8,
        },
        timeout: config.geocode.timeoutMs,
        headers: {
          "User-Agent": config.geocode.userAgent,
          Accept: "application/json",
        },
      });
    } catch (error) {
      if (attempt >= config.geocode.retry || !isRetryable(error)) {
        throw error;
      }
      const waitMs = getRetryDelay(error, attempt);
      logger.warn("Nominatim road search failed, retrying", {
        attempt: attempt + 1,
        waitMs,
      });
      await delay(waitMs);
    }
  }
  return null;
};

const reverseGeocode = async (lat, lng) => {
  const cacheKey = `lat:${lat.toFixed(5)};lng:${lng.toFixed(5)}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return {
      data: cached.data,
      meta: { ...cached.meta, cache: "hit" },
    };
  }

  const response = await requestReverseGeocode(lat, lng);
  const data = response && response.data ? response.data : null;

  const result = {
    data,
    meta: {
      source: "nominatim",
      cache: "miss",
    },
  };

  cache.set(cacheKey, result);
  return result;
};

const searchRoadByName = async (roadName, userCoords = null) => {
  const normalizedRoadName = String(roadName || "").trim();
  const coordsKey =
    userCoords && Number.isFinite(userCoords.lat) && Number.isFinite(userCoords.lng)
      ? `:lat:${userCoords.lat.toFixed(2)}:lng:${userCoords.lng.toFixed(2)}`
      : "";
  const cacheKey = `road:${normalizedRoadName.toLowerCase()}${coordsKey}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return {
      data: cached.data,
      meta: { ...cached.meta, cache: "hit" },
    };
  }

  const response = await requestRoadNameSearch(normalizedRoadName);
  const results = Array.isArray(response?.data) ? response.data : [];
  const selectedResult = pickNearestResult(results, userCoords);

  const result = {
    data: selectedResult,
    meta: {
      source: "nominatim-search",
      cache: "miss",
    },
  };

  cache.set(cacheKey, result);
  return result;
};

module.exports = { reverseGeocode, searchRoadByName };
