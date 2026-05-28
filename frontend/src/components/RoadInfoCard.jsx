import RoadClassificationBadge from "./RoadClassificationBadge.jsx";

const RoadInfoCard = ({ road, coords }) => {
  const hasRoad = Boolean(road?.roadCode || road?.roadName || road?.displayName);
  const confidence = Math.round((road?.confidence || 0) * 100);

  return (
    <div className="rounded-xl border border-border bg-white shadow-card">
      <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
        Road Metadata
      </div>
      <div className="space-y-4 px-6 py-5 text-sm text-ink/70">
        {hasRoad ? (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Road</p>
              <p className="mt-1 text-base font-semibold text-ink">{road.roadName || road.roadCode}</p>
              <p className="text-xs text-ink/50">{road.displayName || ""}</p>
            </div>

            <RoadClassificationBadge
              code={road.roadCode}
              type={road.type}
              name={road.roadName}
              displayName={road.displayName}
            />

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Authority</p>
              <p className="mt-1 text-ink">{road.authority || "Unknown"}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">District / State</p>
              <p className="mt-1 text-ink">
                {road.district || "--"}, {road.state || "--"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Confidence</p>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{ width: `${Math.max(12, confidence)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-ink/50">{confidence}% confidence</p>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-border bg-white px-4 py-3 text-xs text-ink/60">
            Fetch GPS location to retrieve road metadata.
          </div>
        )}

        {coords ? (
          <div className="rounded-lg border border-border bg-white px-4 py-3 text-xs text-ink/60">
            Coordinates: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RoadInfoCard;
