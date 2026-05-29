import RoadClassificationBadge from "./RoadClassificationBadge.jsx";
import StatusCard from "./StatusCard.jsx";

const RoadDetailsPanel = ({ roadData, loading, lastUpdated }) => {
  const road = roadData?.road || {};
  const project = roadData?.project || {};
  const roadName = road.roadName || road.roadCode || "Unknown Road";
  const displayName = road.displayName || "No display name available";
  const roadCode = road.roadCode || null;
  const authority = road.authority || "Unknown";
  const district = road.district || "--";
  const state = road.state || "--";
  const locality = road.locality || "--";
  const classification = road.type || "";

  // Financial data from API
  const sanctioned = project.sanctionedBudgetCrore;
  const spent = project.spentBudgetCrore;
  const completion = project.completionPercentage;
  const spentProgress =
    sanctioned && spent ? Math.round((spent / sanctioned) * 100) : 0;

  // Contractors from API (array)
  const contractors = Array.isArray(project.contractors)
    ? project.contractors
    : project.contractor
    ? [{ name: project.contractor, registration: "Registered with State PWD" }]
    : [];

  return (
    <aside className="flex flex-col gap-6">
      <p className="text-base font-semibold uppercase tracking-[0.18em] text-center text-ink/60">
        Project Deatails
      </p>
      <div className="rounded-xl border border-border bg-navy text-white shadow-card">
        <div className="border-l-4 border-accent px-6 py-6">
          <h3 className="mt-2 font-serif text-2xl">{roadName}</h3>
          <p className="mt-2 text-sm text-white/70">
            Project ID: {project.projectId || `RW-${roadCode || "UN"}`}
          </p>
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
          <StatusCard
            label="Sanctioned"
            value={
              sanctioned != null ? `₹${sanctioned} Cr` : "--"
            }
            progress={spentProgress}
          />
          <StatusCard
            label="Spent"
            value={
              spent != null ? `₹${spent} Cr` : "--"
            }
          />
          {completion != null && (
            <StatusCard
              label="Completion"
              value={`${completion}%`}
              progress={completion}
            />
          )}
          {project.maintenanceStatus && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-2 text-xs">
              <span className="uppercase tracking-[0.12em] text-ink/60">Status</span>
              <span
                className={`font-semibold ${
                  project.maintenanceStatus === "Completed"
                    ? "text-emerald-600"
                    : project.maintenanceStatus === "Delayed"
                    ? "text-red-500"
                    : "text-amber-600"
                }`}
              >
                {project.maintenanceStatus}
              </span>
            </div>
          )}
          {project.auditStatus && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-2 text-xs">
              <span className="uppercase tracking-[0.12em] text-ink/60">Audit</span>
              <span
                className={`font-semibold ${
                  project.auditStatus === "Verified"
                    ? "text-emerald-600"
                    : project.auditStatus === "Flagged"
                    ? "text-red-500"
                    : "text-amber-600"
                }`}
              >
                {project.auditStatus}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Contractor{contractors.length > 1 ? "s" : ""} ({contractors.length})
        </div>
        <div className="divide-y divide-border px-6">
          {contractors.length > 0 ? (
            contractors.map((c, index) => (
              <div key={index} className="py-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-ink">{c.name}</p>
                    <p className="text-[11px] text-ink/60">
                      {c.registration || "Government Empanelled"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-5 text-sm text-ink/50">
              {loading ? "Fetching contractor data..." : "No contractor data available"}
            </div>
          )}
        </div>
      </div>

      <a
        href="#/report"
        className="w-full rounded-lg bg-[#b91c1c] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-soft transition hover:bg-[#991b1b] xl:hidden"
      >
        Report an Issue
      </a>

      {project.summary && (
        <div className="rounded-xl border border-border bg-white shadow-card">
          <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
            AI Summary
          </div>
          <div className="px-6 py-5 text-sm leading-relaxed text-ink/70">
            {project.summary}
          </div>
        </div>
      )}

    </aside>
  );
};

export default RoadDetailsPanel;
