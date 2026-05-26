const getBadgeStyle = (code, type, name, displayName) => {
  const normalized = `${code || ""} ${type || ""} ${name || ""} ${displayName || ""}`.toUpperCase();

  if (normalized.includes("NATIONAL HIGHWAY") || normalized.includes("NH")) {
    return { label: "National Highway", color: "bg-[#f28c28]" };
  }
  if (normalized.includes("STATE HIGHWAY") || normalized.includes("SH")) {
    return { label: "State Highway", color: "bg-[#f2c94c]" };
  }
  if (normalized.includes("MAJOR DISTRICT ROAD") || normalized.includes("MDR")) {
    return { label: "Major District Road", color: "bg-[#3a9b5c]" };
  }

  return { label: "Unknown", color: "bg-slate-400" };
};

const deriveCode = (code, type, name, displayName) => {
  if (code) return code;
  const normalized = `${type || ""} ${name || ""} ${displayName || ""}`.toUpperCase();
  const match = normalized.match(/\b(NH|SH|MDR)\s*-?\s*([0-9A-Z]+)\b/);
  return match ? `${match[1]}${match[2]}` : null;
};

const RoadClassificationBadge = ({ code, type, name, displayName }) => {
  const badge = getBadgeStyle(code, type, name, displayName);
  const displayCode = deriveCode(code, type, name, displayName);

  return (
    <div className="flex items-center gap-3 text-sm text-ink/80">
      <span className={`h-3 w-3 rounded-full ${badge.color}`} />
      <span>{badge.label}</span>
      {displayCode ? <span className="font-semibold text-ink">({displayCode})</span> : null}
    </div>
  );
};

export default RoadClassificationBadge;
