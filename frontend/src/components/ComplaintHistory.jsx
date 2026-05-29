const formatSummary = (text, limit = 140) => {
  if (!text) return null;
  const trimmed = String(text).trim();
  if (!trimmed) return null;
  if (trimmed.length <= limit) return trimmed;
  return `${trimmed.slice(0, limit).trim()}...`;
};

const formatDate = (value) => {
  if (!value) return "Unknown time";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
};

const ComplaintHistory = ({ complaints, loading, error, onRefresh }) => {
  const items = Array.isArray(complaints) ? complaints : [];
  const visibleItems = items.slice(0, 3);

  return (
    <div className="rounded-xl border border-border bg-white shadow-card">
      <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
        <div className="flex items-center justify-between">
          <span>Complaint History</span>
          {onRefresh ? (
            <button
              type="button"
              className="text-[10px] uppercase tracking-[0.12em] text-white/80 transition hover:text-white disabled:opacity-60"
              onClick={onRefresh}
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          ) : null}
        </div>
      </div>
      <div className="space-y-4 px-6 py-5 text-sm text-ink/70">
        {loading ? (
          <div className="rounded-lg border border-border bg-white px-4 py-4 text-xs text-ink/60">
            Loading complaint history...
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {error}
          </div>
        ) : visibleItems.length ? (
          visibleItems.map((complaint) => {
            const summary = formatSummary(complaint.description);
            const complaintId = complaint.complaintId || `Complaint #${complaint.id}`;
            const roadLabel = complaint.roadName || complaint.roadCode;

            return (
              <div
                key={complaint.complaintId || complaint.id}
                className="rounded-lg border border-border bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-ink/50">
                  <span>{complaint.issueType || "Issue"}</span>
                  <span>{complaint.status || "Submitted"}</span>
                </div>
                <p className="mt-2 text-base font-semibold text-ink">{complaintId}</p>
                {roadLabel ? (
                  <p className="mt-1 text-xs text-ink/60">Road: {roadLabel}</p>
                ) : null}
                {summary ? <p className="mt-2 text-xs text-ink/60">{summary}</p> : null}
                <p className="mt-2 text-xs text-ink/50">{formatDate(complaint.createdAt)}</p>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-border bg-white px-4 py-4 text-xs text-ink/60">
            No complaints submitted yet.
          </div>
        )}

        {items.length > 3 ? (
          <a
            href="#/dashboard"
            className="block w-full rounded-md border border-navy px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.12em] text-navy transition hover:border-accent hover:text-accent"
          >
            View All Complaints
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default ComplaintHistory;
