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

module.exports = { reverseGeocode };
