"use strict";

const fs = require("fs");
const path = require("path");

const { logger } = require("../utils/logger");

let complaints = [];
let counters = new Map();

const dataDir = path.join(__dirname, "..", "data");
const storeFile = path.join(dataDir, "complaints.json");

const toAbbr = (value) => {
  if (!value) return "UNK";
  const letters = String(value).replace(/[^A-Za-z]/g, "");
  if (!letters) return "UNK";
  return letters.slice(0, 3).toUpperCase();
};

const normalizeRoadCode = (value) => {
  if (!value) return "RD";
  return String(value).replace(/\s+/g, "").toUpperCase();
};

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

const parseComplaintKey = (complaintId) => {
  if (!complaintId) return null;
  const parts = String(complaintId).split("-");
  if (parts.length < 5 || parts[0] !== "RW") return null;

  const sequence = Number(parts.pop());
  const year = parts.pop();
  const districtCode = parts.pop();
  const roadCode = parts.slice(1).join("-");

  if (!Number.isFinite(sequence) || !year || !districtCode) return null;

  return {
    key: `${roadCode}-${districtCode}-${year}`,
    sequence,
  };
};

const rebuildCountersFromComplaints = () => {
  const next = new Map(counters);
  for (const complaint of complaints) {
    const parsed = parseComplaintKey(complaint.complaintId);
    if (!parsed) continue;
    const current = next.get(parsed.key) || 0;
    if (parsed.sequence > current) {
      next.set(parsed.key, parsed.sequence);
    }
  }
  counters = next;
};

const loadStore = () => {
  try {
    if (!fs.existsSync(storeFile)) return;
    const raw = fs.readFileSync(storeFile, "utf8");
    if (!raw) return;
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      complaints = parsed;
      rebuildCountersFromComplaints();
      return;
    }

    complaints = Array.isArray(parsed.complaints) ? parsed.complaints : [];
    counters = new Map();
    if (parsed.counters && typeof parsed.counters === "object") {
      for (const [key, value] of Object.entries(parsed.counters)) {
        const num = Number(value);
        counters.set(key, Number.isFinite(num) ? num : 0);
      }
    }
    rebuildCountersFromComplaints();
  } catch (error) {
    logger.warn("Failed to load complaint store", { message: error.message });
  }
};

const persistStore = () => {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    const countersObject = {};
    for (const [key, value] of counters.entries()) {
      countersObject[key] = value;
    }
    const payload = JSON.stringify({ complaints, counters: countersObject }, null, 2);
    fs.writeFileSync(storeFile, payload);
  } catch (error) {
    logger.warn("Failed to persist complaint store", { message: error.message });
  }
};

const getSequence = (key) => {
  const current = counters.get(key) || 0;
  const next = current + 1;
  counters.set(key, next);
  return String(next).padStart(3, "0");
};

const buildComplaintId = ({ roadCode, district, state, year }) => {
  const code = normalizeRoadCode(roadCode);
  const districtCode = toAbbr(district) !== "UNK" ? toAbbr(district) : toAbbr(state);
  const key = `${code}-${districtCode}-${year}`;
  const sequence = getSequence(key);
  return `RW-${code}-${districtCode}-${year}-${sequence}`;
};

const createComplaint = (payload) => {
  const createdAt = new Date();
  const status = payload.status || "Submitted";
  const assignedAuthority = payload.assignedAuthority || payload.authority || "District PWD";
  const engineerAssigned = payload.engineerAssigned || "Executive Engineer (Roads)";
  const estimatedCompletion = payload.estimatedCompletion || addDays(createdAt, 14).toISOString().slice(0, 10);
  const timeline =
    Array.isArray(payload.timeline) && payload.timeline.length
      ? payload.timeline
      : buildTimeline(status, createdAt, assignedAuthority);
  const progressPercent =
    typeof payload.progressPercent === "number" ? payload.progressPercent : deriveProgressPercent(status);
  const complaintId = buildComplaintId({
    roadCode: payload.roadCode,
    district: payload.district,
    state: payload.state,
    year: createdAt.getFullYear(),
  });

  const complaint = {
    id: complaints.length + 1,
    complaintId,
    userId: payload.userId || null,
    roadCode: payload.roadCode || null,
    roadName: payload.roadName || null,
    roadType: payload.roadType || null,
    authority: payload.authority || null,
    assignedAuthority,
    engineerAssigned,
    district: payload.district || null,
    state: payload.state || null,
    lat: payload.lat,
    lng: payload.lng,
    issueType: payload.issueType,
    description: payload.description || null,
    summary: payload.summary || null,
    severity: payload.severity || null,
    priority: payload.priority || null,
    riskScore: payload.riskScore || null,
    mediaUrl: payload.mediaUrl || null,
    media: payload.media || null,
    status,
    progressPercent,
    estimatedCompletion,
    timeline,
    satisfactionRating: payload.satisfactionRating || null,
    completionMedia: payload.completionMedia || null,
    createdAt: createdAt.toISOString(),
    submittedAt: createdAt.toISOString(),
  };

  complaints.push(complaint);
  persistStore();
  return complaint;
};

const listComplaints = () => complaints.slice();

const getComplaintById = (id) => {
  if (!id) return null;
  const normalized = String(id).trim();
  const numeric = Number(normalized);
  return (
    complaints.find((complaint) => complaint.complaintId === normalized) ||
    (Number.isFinite(numeric) ? complaints.find((complaint) => complaint.id === numeric) : null)
  );
};

const listComplaintsByUser = (userId) => {
  if (!userId) return [];
  const normalized = String(userId);
  return complaints.filter((complaint) => String(complaint.userId || "") === normalized);
};

loadStore();

module.exports = {
  createComplaint,
  listComplaints,
  getComplaintById,
  listComplaintsByUser,
  buildTimeline,
  deriveProgressPercent,
};
