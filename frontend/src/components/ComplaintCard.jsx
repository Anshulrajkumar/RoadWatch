import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge.jsx";

const summarize = (complaint) => {
  const text = complaint.summary || complaint.description || "";
  const trimmed = String(text).trim();
  if (!trimmed) return "No description provided.";
  return trimmed.length > 140 ? `${trimmed.slice(0, 140).trim()}...` : trimmed;
};

const formatDate = (value) => {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
};

const stageOrder = [
  "Complaint Submitted",
  "Complaint Approved",
  "Assigned to Local Authority",
  "Work In Progress",
  "Work Completed",
];

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

const buildFallbackTimeline = (status) => {
  const index = getStageIndex(status);
  return stageOrder.map((stage, stepIndex) => ({
    stage,
    completed: stepIndex <= index,
    current: stepIndex === index,
  }));
};

const getStepState = (step) => {
  if (step?.current) return "current";
  if (step?.completed) return "completed";
  return "pending";
};

const getProgressPercent = (steps) => {
  if (!steps.length) return 0;
  const currentIndex = steps.findIndex((step) => step.current);
  const completedIndex = steps.reduce((acc, step, idx) => (step.completed ? idx : acc), -1);
  const progressIndex = Math.max(currentIndex, completedIndex, 0);
  return Math.round(((progressIndex + 1) / steps.length) * 100);
};

const ComplaintCard = ({ complaint, active, onSelect }) => {
  const roadLabel = complaint.roadName || complaint.roadCode || "Unknown road";
  const steps = Array.isArray(complaint.timeline) && complaint.timeline.length
    ? complaint.timeline
    : buildFallbackTimeline(complaint.status);
  const progressPercent = getProgressPercent(steps);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(complaint)}
      className={`w-full text-left transition ${
        active ? "border-accent/50 bg-accent/5" : "border-border bg-white"
      } rounded-xl border px-4 py-4 shadow-card`}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink/50">{complaint.complaintId}</p>
          <p className="mt-2 text-lg font-semibold text-ink">{complaint.issueType || "Road Issue"}</p>
          <p className="mt-1 text-sm text-ink/70">Road: {roadLabel}</p>
          <p className="mt-1 text-xs text-ink/50">
            {complaint.district || "Unknown"}, {complaint.state || "Unknown"}
          </p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="mt-3 text-sm text-ink/60">{summarize(complaint)}</p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-ink/50">
          <span>Tracking Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="relative">
          <div className="absolute left-0 right-0 top-2 h-1 rounded-full bg-muted" />
          <div
            className="absolute left-0 top-2 h-1 rounded-full bg-accent"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
          <div className="relative grid grid-cols-5">
            {steps.map((step, index) => {
              const state = getStepState(step);
              const tone =
                state === "completed"
                  ? "bg-emerald-500"
                  : state === "current"
                    ? "bg-accent"
                    : "bg-white";
              const ring =
                state === "pending"
                  ? "border-border"
                  : state === "current"
                    ? "border-accent"
                    : "border-emerald-500";

              return (
                <span key={`${step.stage}-${index}`} className="flex items-center justify-center">
                  <span
                    className={`h-3 w-3 rounded-full border ${ring} ${tone} ${
                      state === "current" ? "animate-pulse" : ""
                    }`}
                  />
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-ink/60">
        <span>Submitted: {formatDate(complaint.submittedAt || complaint.createdAt)}</span>
        {complaint.severity ? <span>Severity: {complaint.severity}</span> : null}
      </div>
    </motion.button>
  );
};

export default ComplaintCard;
