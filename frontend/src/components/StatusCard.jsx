const StatusCard = ({ label, value, helper, progress }) => {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-white px-4 py-3">
      <div className="flex items-center justify-between text-xs text-ink/60">
        <span className="uppercase tracking-[0.12em]">{label}</span>
        <span className="text-ink">{value}</span>
      </div>
      {typeof progress === "number" ? (
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-accent"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      ) : null}
      {helper ? <p className="text-[11px] text-ink/60">{helper}</p> : null}
    </div>
  );
};

export default StatusCard;
