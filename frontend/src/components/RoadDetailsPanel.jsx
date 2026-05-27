import RoadClassificationBadge from "./RoadClassificationBadge.jsx";
import StatusCard from "./StatusCard.jsx";

const RoadDetailsPanel = ({ roadData, loading, lastUpdated }) => {
  const road = roadData?.road || {};
  const hasRoad = Boolean(
    roadData?.success && (road.roadName || road.roadCode || road.displayName)
  );
  const project = roadData?.project || null;
  const hasProject = Boolean(project && Object.keys(project).length > 0);
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
          <h3 className="mt-2 font-serif text-2xl">{hasRoad ? roadName : "No location selected"}</h3>
          <p className="mt-2 text-sm text-white/70">
            {hasProject
              ? `Project ID: ${project.projectId}`
              : hasRoad
                ? `Project ID: RW-${roadCode || "UN"}`
                : "No project selected"}
          </p>
          <p className="mt-3 text-xs text-white/60">{hasRoad ? displayName : "No display name available"}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Road Classification
        </div>
        <div className="space-y-4 px-6 py-5">
          {hasRoad ? (
            <>
              <RoadClassificationBadge
                code={roadCode}
                type={classification}
                name={roadName}
                displayName={displayName}
              />
              <div className="h-1 w-full rounded-full bg-muted">
                <div className="h-1 w-2/3 rounded-full bg-accent" />
              </div>
            </>
          ) : (
            <p className="text-sm text-ink/70">No classification data available — search or select a location on the map.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Executing Authority
        </div>
        <div className="space-y-2 px-6 py-5 text-sm text-ink/70">
          {hasRoad ? (
            <>
              <p className="font-semibold text-ink">{authority}</p>
              <p>
                {locality}, {district}, {state}
              </p>
            </>
          ) : (
            <p className="text-sm text-ink/70">No authority information — select a location to view the executing authority.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Financial Audit
        </div>
        <div className="space-y-3 px-6 py-5 text-sm text-ink/70">
          {hasProject ? (
            <>
              <StatusCard
                label="Sanctioned"
                value={`₹${project.sanctionedBudgetCrore ?? "--"} Cr`}
                progress={project.completionPercentage}
                helper={project.summary}
              />
              <StatusCard
                label="Spent"
                value={`₹${project.spentBudgetCrore ?? "--"} Cr`}
                progress={project.completionPercentage}
                helper={`Status: ${project.maintenanceStatus || "--"} · Audit: ${project.auditStatus || "--"}`}
              />
            </>
          ) : hasRoad ? (
            <p className="text-sm text-ink/70">Project audit data is not available for this road yet.</p>
          ) : (
            <p className="text-sm text-ink/70">No financial audit information available for the selected location.</p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Contractor Name
        </div>
        <div className="px-6 py-5 text-sm text-ink/70">
          {hasProject ? (
            <>
              <p className="font-semibold text-ink">{project.contractor || "Unknown Contractor"}</p>
              <p className="text-[11px] text-ink/60">Last relaying: {project.lastRelayingDate || "--"}</p>
            </>
          ) : hasRoad ? (
            <p className="text-sm text-ink/70">Contractor information is not available for this road yet.</p>
          ) : (
            <p className="text-sm text-ink/70">No contractor data for the selected location.</p>
          )}
        </div>
      </div>

      <div />
    </aside>
  );
};

export default RoadDetailsPanel;
