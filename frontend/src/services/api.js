import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
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

export const getRoadByName = async (roadName, lat, lng) => {
  const params = { roadName };

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    params.lat = lat;
    params.lng = lng;
  }

  const response = await api.get("/api/road/search", { params });
  return response.data;
};

export const reportIssue = async (formData, onUploadProgress) => {
  const response = await api.post("/api/issues/report", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response.data;
};

export const rewriteIssueDescription = async (payload) => {
  const response = await api.post("/api/issues/rewrite", payload);
  return response.data;
};

export const getComplaintHistory = async (limit) => {
  const params = Number.isFinite(limit) ? { limit } : undefined;
  const response = await api.get("/api/issues/history", { params });
  return response.data;
};

export const getComplaints = async (limit) => {
  const params = Number.isFinite(limit) ? { limit } : undefined;
  const response = await api.get("/api/complaints", { params });
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await api.get(`/api/complaints/${id}`);
  return response.data;
};

export const getComplaintHistoryByUser = async (userId) => {
  const response = await api.get(`/api/complaints/history/${userId}`);
  return response.data;
};

export default api;
