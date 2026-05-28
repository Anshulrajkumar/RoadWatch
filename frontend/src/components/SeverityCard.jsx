const SeverityCard = ({ insight, loading }) => {
  return (
    <div className="rounded-xl border border-border bg-white shadow-card">
      <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
        AI Severity
      </div>
      <div className="space-y-4 px-6 py-5 text-sm text-ink/70">
        {loading ? (
          <div className="rounded-lg border border-border bg-white px-4 py-4 text-xs text-ink/60">
            Analyzing issue severity...
          </div>
        ) : insight ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-accent px-3 py-1 text-xs uppercase tracking-[0.12em] text-white">
                {insight.severity}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.12em] text-ink/60">
                Priority: {insight.priority}
              </span>
              <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.12em] text-ink/60">
                Danger: {insight.dangerLevel}
              </span>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Infrastructure Impact</p>
              <p className="mt-1 text-ink">{insight.impact}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Risk Score</p>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-accent"
                  style={{ width: `${Math.min(100, insight.riskScore || 0)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-ink/50">{insight.riskScore}/100</p>
            </div>

            <div className="rounded-lg border border-border bg-white px-4 py-3 text-xs text-ink/60">
              {insight.summary}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-border bg-white px-4 py-4 text-xs text-ink/60">
            Submit a complaint to generate AI severity insights.
          </div>
        )}
      </div>
    </div>
  );
};

export default SeverityCard;
