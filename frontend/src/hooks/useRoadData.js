import { useCallback, useEffect, useState } from "react";
import { getNearestRoad, getRoadByName } from "../services/api";
import { useGeolocation } from "./useGeolocation";

export const useRoadData = () => {
  const { getCurrentLocation } = useGeolocation();
  const [userCoords, setUserCoords] = useState(null);
  const [coords, setCoords] = useState(null);
  const [roadData, setRoadData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (userCoords) {
      return () => {
        cancelled = true;
      };
    }

    const hydrateInitialCoords = async () => {
      try {
        const position = await getCurrentLocation({ timeout: 8000, maximumAge: 120000 });
        if (!cancelled) {
          setUserCoords({ lat: position.latitude, lng: position.longitude });
        }
      } catch (geoError) {
        // Ignore geolocation failures to preserve existing fallback map behavior.
      }
    };

    hydrateInitialCoords();

    return () => {
      cancelled = true;
    };
  }, [userCoords, getCurrentLocation]);

  const fetchByCoords = useCallback(async (lat, lng, skipLoading = false) => {
    try {
      if (!skipLoading) {
        setLoading(true);
      }
      setError(null);
      const data = await getNearestRoad(lat, lng);
      setRoadData(data);
      setCoords({ lat, lng });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || "Unable to fetch road information.");
    } finally {
      setLoading(false);
    }
  }, []);

  const useMyLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const position = await getCurrentLocation();
      setUserCoords({ lat: position.latitude, lng: position.longitude });
      await fetchByCoords(position.latitude, position.longitude, true);
    } catch (err) {
      setError(err?.message || "Unable to access your location.");
      setLoading(false);
    }
  }, [fetchByCoords, getCurrentLocation]);

  const fetchByRoadName = useCallback(async (roadName) => {
    try {
      setLoading(true);
      setError(null);

      let searchCoords = userCoords || coords;
      if (!searchCoords) {
        try {
          const position = await getCurrentLocation({ timeout: 5000, maximumAge: 30000 });
          searchCoords = { lat: position.latitude, lng: position.longitude };
          setUserCoords(searchCoords);
        } catch (geoError) {
          searchCoords = null;
        }
      }

      const data = await getRoadByName(roadName, searchCoords?.lat, searchCoords?.lng);
      setRoadData(data);
      if (data?.coordinates) {
        setCoords({ lat: data.coordinates.lat, lng: data.coordinates.lng });
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.message || "Unable to search road by name.");
    } finally {
      setLoading(false);
    }
  }, [coords, getCurrentLocation, userCoords]);

  return {
    userCoords,
    coords,
    roadData,
    loading,
    error,
    lastUpdated,
    fetchByCoords,
    fetchByRoadName,
    useMyLocation,
    setCoords,
  };
};
