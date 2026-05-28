import { FiCalendar, FiMapPin } from "react-icons/fi";
import StatusBadge from "./StatusBadge.jsx";
import ComplaintMap from "./ComplaintMap.jsx";

const formatDateTime = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString();
};

const ComplaintDetailPanel = ({ complaint, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-xl border border-border bg-white" />
        <div className="h-56 animate-pulse rounded-xl border border-border bg-white" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="rounded-xl border border-border bg-white px-4 py-4 text-sm text-ink/60 shadow-card">
        Select a complaint to view full tracking details.
      </div>
    );
  }

  const coords =
    Number.isFinite(complaint.lat) && Number.isFinite(complaint.lng)
      ? { lat: complaint.lat, lng: complaint.lng }
      : null;
  const roadLabel = complaint.roadName || complaint.roadCode || "Unknown road";
  const authority = complaint.assignedAuthority || complaint.authority || "--";
  const engineer = complaint.engineerAssigned || "--";
  const mediaUrl = complaint.media?.imageUrl || complaint.mediaUrl || null;
  const completionPhotos = Array.isArray(complaint.completionMedia) ? complaint.completionMedia : [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-navy text-white shadow-card">
        <div className="border-l-4 border-accent px-6 py-6">
          <p className="small-caps text-white/70">Complaint Tracking</p>
          <h3 className="mt-2 font-serif text-2xl">{complaint.complaintId}</h3>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/70">
            <span className="flex items-center gap-2">
              <FiMapPin /> {roadLabel}
            </span>
            <span className="flex items-center gap-2">
              <FiCalendar /> {formatDateTime(complaint.submittedAt || complaint.createdAt)}
            </span>
          </div>
          <div className="mt-4">
            <StatusBadge status={complaint.status} size="lg" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Complaint Overview
        </div>
        <div className="grid gap-4 px-6 py-5 text-sm text-ink/70">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Issue Summary</p>
            <p className="mt-2 text-ink">{complaint.summary || complaint.description || "No summary available."}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Issue Type</p>
              <p className="mt-1 text-ink">{complaint.issueType || "--"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Assigned Authority</p>
              <p className="mt-1 text-ink">{authority}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Engineer Assigned</p>
              <p className="mt-1 text-ink">{engineer}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Severity</p>
              <p className="mt-1 text-ink">{complaint.severity || "--"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Estimated Completion</p>
              <p className="mt-1 text-ink">{complaint.estimatedCompletion || "--"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">District and State</p>
              <p className="mt-1 text-ink">
                {complaint.district || "--"}, {complaint.state || "--"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ComplaintMap coords={coords} />

      <div className="rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
          Evidence Media
        </div>
        <div className="grid gap-4 px-6 py-5 text-sm text-ink/70">
          {mediaUrl ? (
            <img
              src={mediaUrl}
              alt="Uploaded evidence"
              className="h-44 w-full rounded-lg border border-border object-cover"
            />
          ) : (
            <div className="rounded-lg border border-border bg-white px-4 py-6 text-xs text-ink/60">
              No evidence uploaded.
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Completion Photos</p>
            {completionPhotos.length ? (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {completionPhotos.map((photo, index) => (
                  <img
                    key={`${photo}-${index}`}
                    src={photo}
                    alt="Completion evidence"
                    className="h-24 w-full rounded-md border border-border object-cover"
                  />
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-ink/50">Awaiting completion photos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPanel;
