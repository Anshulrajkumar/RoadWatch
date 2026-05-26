import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  timeout: 12000,
  headers: {
    Accept: "application/json",
  },
});

export const getNearestRoad = async (lat, lng) => {
  const response = await api.get("/api/road/nearest", {
    params: { lat, lng },
  });
  return response.data;
};

export default api;
