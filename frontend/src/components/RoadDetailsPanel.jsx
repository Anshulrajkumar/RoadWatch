import RoadClassificationBadge from "./RoadClassificationBadge.jsx";
import StatusCard from "./StatusCard.jsx";

const RoadDetailsPanel = ({ roadData, loading, lastUpdated }) => {
  const road = roadData?.road || {};
  const roadName = road.roadName || road.roadCode || "Unknown Road";
  const displayName = road.displayName || "No display name available";
  const roadCode = road.roadCode || null;
  const authority = road.authority || "Unknown";
  const district = road.district || "--";
  const state = road.state || "--";
  const locality = road.locality || "--";
  const classification = road.type || "";


  return (
    <aside className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-navy text-white shadow-card">
        <div className="border-l-4 border-accent px-6 py-6">
          <p className="small-caps text-white/70">Project Detailed View</p>
          <h3 className="mt-2 font-serif text-2xl">{roadName}</h3>
          <p className="mt-2 text-sm text-white/70">Project ID: RW-{roadCode || "UN"}</p>
          <p className="mt-3 text-xs text-white/60">{displayName}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Road Classification
        </div>
        <div className="space-y-4 px-6 py-5">
          <RoadClassificationBadge
            code={roadCode}
            type={classification}
            name={roadName}
            displayName={displayName}
          />
          <div className="h-1 w-full rounded-full bg-muted">
            <div className="h-1 w-2/3 rounded-full bg-accent" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Executing Authority
        </div>
        <div className="space-y-2 px-6 py-5 text-sm text-ink/70">
          <p className="font-semibold text-ink">{authority}</p>
          <p>
            {locality}, {district}, {state}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Financial Audit
        </div>
        <div className="space-y-3 px-6 py-5 text-sm text-ink/70">
          <StatusCard label="Sanctioned" value="₹12.40 Cr" progress={72} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Contractor Name
        </div>
        <div className="px-6 py-5 text-sm text-ink/70">
          <p className="font-semibold text-ink">Aarav InfraWorks Pvt. Ltd.</p>
          <p className="text-[11px] text-ink/60">Registered with State PWD</p>
        </div>
      </div>

      <a
        href="#/report"
        className="rounded-lg bg-accent px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-soft transition hover:bg-accent-soft"
      >
        Report an Issue
      </a>
    </aside>
  );
};

export default RoadDetailsPanel;
