import axios from "axios";
import { supabase } from "../lib/supabase.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
});

// Attach Supabase JWT to every outgoing request when a session exists
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
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
    timeout: 120000,
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

/**
 * Fetch only the authenticated user's complaints.
 * The backend verifies the JWT and returns complaints where user_id matches.
 */
export const getMyComplaints = async () => {
  const response = await api.get("/api/my-complaints");
  return response.data;
};

export default api;
