const ComplaintSummary = ({ complaint }) => {
  return (
    <div className="rounded-xl border border-border bg-white shadow-card">
      <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
        Complaint Summary
      </div>
      <div className="space-y-4 px-6 py-5 text-sm text-ink/70">
        {complaint ? (
          <>
            <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.12em] text-ink/60">Complaint Submitted Successfully</p>
              <p className="mt-2 text-lg font-semibold text-ink">{complaint.complaintId}</p>
              <p className="text-xs text-ink/60">Status: {complaint.status}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Issue Type</p>
              <p className="mt-1 text-ink">{complaint.issueType}</p>
            </div>

            {complaint.severity ? (
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Severity</p>
                <p className="mt-1 text-ink">{complaint.severity}</p>
              </div>
            ) : null}

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Road</p>
              <p className="mt-1 text-ink">{complaint.roadName || complaint.roadCode}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Timestamp</p>
              <p className="mt-1 text-ink">{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-border bg-white px-4 py-4 text-xs text-ink/60">
            Complaint details will appear after submission.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintSummary;
