"use strict";

// Simple in-memory TTL cache with a hard size cap.
const createCache = (ttlMs, maxEntries) => {
  if (!ttlMs || ttlMs <= 0) {
    return {
      get: () => null,
      set: () => {},
    };
  }

  const store = new Map();

  const prune = () => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (!entry || entry.expiresAt <= now) {
        store.delete(key);
      }
    }
    while (store.size > maxEntries) {
      const firstKey = store.keys().next().value;
      if (firstKey === undefined) break;
      store.delete(firstKey);
    }
  };

  const get = (key) => {
    const entry = store.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      store.delete(key);
      return null;
    }
    return entry.value;
  };

  const set = (key, value) => {
    prune();
    store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  };

  return { get, set };
};

module.exports = { createCache };
