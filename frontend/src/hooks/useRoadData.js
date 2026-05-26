import { useCallback, useState } from "react";
import { getNearestRoad } from "../services/api";
import { useGeolocation } from "./useGeolocation";

export const useRoadData = () => {
  const { getCurrentLocation } = useGeolocation();
  const [coords, setCoords] = useState(null);
  const [roadData, setRoadData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

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
      await fetchByCoords(position.latitude, position.longitude, true);
    } catch (err) {
      setError(err?.message || "Unable to access your location.");
      setLoading(false);
    }
  }, [fetchByCoords, getCurrentLocation]);

  return {
    coords,
    roadData,
    loading,
    error,
    lastUpdated,
    fetchByCoords,
    useMyLocation,
    setCoords,
  };
};
