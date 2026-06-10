"use strict";

const { createClient } = require("@supabase/supabase-js");
const { logger } = require("../utils/logger");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  logger.warn("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env. Database operations will fail.");
}

const timelineStages = [
  { stage: "Complaint Submitted", actor: "Citizen Portal" },
  { stage: "Complaint Approved", actor: "Executive Engineer" },
  { stage: "Assigned to Local Authority", actor: "District Control Room" },
  { stage: "Work In Progress", actor: "PWD Division" },
  { stage: "Work Completed", actor: "Quality Audit Cell" },
];

const addDays = (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const getStageIndex = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("completed")) return 4;
  if (normalized.includes("progress")) return 3;
  if (normalized.includes("assigned")) return 2;
  if (normalized.includes("approved")) return 1;
  if (normalized.includes("rejected")) return 1;
  if (normalized.includes("escalated")) return 2;
  return 0;
};

const deriveProgressPercent = (status) => {
  const index = getStageIndex(status);
  return Math.round(((index + 1) / timelineStages.length) * 100);
};

const buildTimeline = (status, createdAt, assignedAuthority) => {
  const index = getStageIndex(status);
  const baseDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  return timelineStages.map((item, stepIndex) => {
    const completed = stepIndex < index || stepIndex === index;
    const current = stepIndex === index;
    const timestamp = stepIndex <= index ? addDays(baseDate, stepIndex).toISOString() : null;
    const note =
      stepIndex === 2 && assignedAuthority
        ? `Assigned to ${assignedAuthority}.`
        : stepIndex === 3
          ? "Work order issued and site mobilization started."
          : null;

    return {
      stage: item.stage,
      completed,
      current,
      timestamp,
      actor: item.actor,
      note,
    };
  });
};

const createComplaint = async (payload) => {
  if (!supabase) throw new Error("Supabase is not configured.");

  // For Hackathon prototype, we just generate a simple ID if not provided
  const complaintId = payload.complaintId || `RW-${Math.floor(Math.random() * 1000000)}`;

  const complaint = {
    complaint_id: complaintId,
    user_id: payload.userId || null,
    road_code: payload.roadCode || null,
    road_name: payload.roadName || null,
    road_type: payload.roadType || null,
    authority: payload.authority || null,
    assigned_authority: payload.assignedAuthority || payload.authority || "District PWD",
    engineer_assigned: payload.engineerAssigned || "Executive Engineer (Roads)",
    district: payload.district || null,
    state: payload.state || null,
    latitude: payload.lat,
    longitude: payload.lng,
    issue_type: payload.issueType,
    description: payload.description || null,
    severity: payload.severity || null,
    priority: payload.priority || null,
    risk_score: payload.riskScore || null,
    image_url: payload.media?.imageUrl || payload.mediaUrl || null,
    video_url: payload.media?.videoUrl || null,
    status: payload.status || "Submitted",
    progress_percent: typeof payload.progressPercent === "number" ? payload.progressPercent : deriveProgressPercent(payload.status || "Submitted"),
    estimated_completion: payload.estimatedCompletion || addDays(new Date(), 14).toISOString(),
  };

  console.log(`[STAGE 5: DATABASE INSERT] payload lat=${complaint.latitude}, lng=${complaint.longitude}`);

  const { data, error } = await supabase
    .from("complaints")
    .insert([complaint])
    .select()
    .single();

  if (error) {
    logger.error("Failed to insert complaint to Supabase", error);
    throw error;
  }

  return mapSupabaseToFrontend(data);
};

const listComplaints = async () => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Failed to fetch complaints", error);
    return [];
  }
  return data.map(mapSupabaseToFrontend);
};

const getComplaintById = async (id) => {
  if (!supabase || !id) return null;
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("complaint_id", id)
    .single();

  if (error) {
    return null;
  }
  return mapSupabaseToFrontend(data);
};

const listComplaintsByUser = async (userId) => {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Failed to fetch user complaints", error);
    return [];
  }
  return data.map(mapSupabaseToFrontend);
};

// Map snake_case from DB to camelCase expected by frontend
const mapSupabaseToFrontend = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    complaintId: row.complaint_id,
    userId: row.user_id,
    roadCode: row.road_code,
    roadName: row.road_name,
    roadType: row.road_type,
    authority: row.authority,
    assignedAuthority: row.assigned_authority,
    engineerAssigned: row.engineer_assigned,
    district: row.district,
    state: row.state,
    lat: row.latitude,
    lng: row.longitude,
    issueType: row.issue_type,
    description: row.description,
    severity: row.severity,
    priority: row.priority,
    riskScore: row.risk_score,
    mediaUrl: row.image_url || row.video_url,
    media: {
      imageUrl: row.image_url,
      videoUrl: row.video_url,
    },
    status: row.status,
    progressPercent: row.progress_percent,
    estimatedCompletion: row.estimated_completion,
    createdAt: row.created_at,
    submittedAt: row.submitted_at || row.created_at,
    timeline: buildTimeline(row.status || "Submitted", row.created_at || new Date(), row.assigned_authority),
  };
};

module.exports = {
  createComplaint,
  listComplaints,
  getComplaintById,
  listComplaintsByUser,
  buildTimeline,
  deriveProgressPercent,
};
