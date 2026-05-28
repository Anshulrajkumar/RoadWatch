const statusStyles = {
  Submitted: "border-slate-200 bg-slate-50 text-slate-700",
  Approved: "border-blue-200 bg-blue-50 text-blue-700",
  Escalated: "border-red-200 bg-red-50 text-red-700",
  Assigned: "border-indigo-200 bg-indigo-50 text-indigo-700",
  "In Progress": "border-accent/30 bg-accent/15 text-accent",
  "Work In Progress": "border-accent/30 bg-accent/15 text-accent",
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Work Completed": "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rejected: "border-rose-200 bg-rose-50 text-rose-700",
};

const normalizeStatus = (status) => {
  if (!status) return "Submitted";
  const trimmed = String(status).trim();
  return statusStyles[trimmed] ? trimmed : "Submitted";
};

const StatusBadge = ({ status, size = "sm" }) => {
  const label = normalizeStatus(status);
  const style = statusStyles[label] || statusStyles.Submitted;
  const textSize = size === "lg" ? "text-xs" : "text-[11px]";

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 uppercase tracking-[0.12em] ${textSize} ${style}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
