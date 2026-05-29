import { useEffect, useMemo, useState } from "react";
import { FiFilter, FiRefreshCw, FiSearch } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getMyComplaints } from "../services/api";
import ComplaintCard from "../components/ComplaintCard.jsx";
import ComplaintDetailPanel from "../components/ComplaintDetailPanel.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const statusOptions = [
  "All",
  "Submitted",
  "Approved",
  "Assigned",
  "In Progress",
  "Work In Progress",
  "Completed",
  "Rejected",
  "Escalated",
];

const severityRank = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const StatCard = ({ label, value, accent }) => (
  <div className={`rounded-xl border px-5 py-4 text-center ${accent ? "border-accent/30 bg-accent/5" : "border-border bg-white"}`}>
    <p className="text-xs uppercase tracking-[0.14em] text-ink/50">{label}</p>
    <p className={`mt-1 text-2xl font-semibold ${accent ? "text-accent" : "text-ink"}`}>{value}</p>
  </div>
);

const ComplaintHistoryPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "All",
    roadType: "All",
    district: "All",
    sort: "newest",
  });

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyComplaints();
      setComplaints(response?.complaints || []);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to load complaints.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  // --- Dashboard statistics (dynamic from user's complaints) ---
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter(
      (c) => (c.status || "Submitted") === "Submitted"
    ).length;
    const inProgress = complaints.filter((c) =>
      ["In Progress", "Work In Progress", "Assigned", "Approved"].includes(c.status || "")
    ).length;
    const resolved = complaints.filter(
      (c) => (c.status || "") === "Completed"
    ).length;
    return { total, pending, inProgress, resolved };
  }, [complaints]);

  const districtOptions = useMemo(() => {
    const set = new Set(complaints.map((item) => item.district).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [complaints]);

  const roadTypeOptions = useMemo(() => {
    const set = new Set(complaints.map((item) => item.roadType || item.roadCode).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    let items = [...complaints];

    if (filters.status !== "All") {
      items = items.filter((item) => (item.status || "Submitted") === filters.status);
    }

    if (filters.roadType !== "All") {
      items = items.filter((item) =>
        String(item.roadType || item.roadCode || "").toLowerCase().includes(filters.roadType.toLowerCase())
      );
    }

    if (filters.district !== "All") {
      items = items.filter((item) => item.district === filters.district);
    }

    if (query) {
      items = items.filter((item) => {
        const haystack = [
          item.complaintId,
          item.issueType,
          item.roadName,
          item.roadCode,
          item.district,
          item.state,
          item.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    if (filters.sort === "newest") {
      items.sort(
        (a, b) =>
          new Date(b.submittedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.createdAt).getTime()
      );
    }

    if (filters.sort === "oldest") {
      items.sort(
        (a, b) =>
          new Date(a.submittedAt || a.createdAt).getTime() - new Date(b.submittedAt || b.createdAt).getTime()
      );
    }

    if (filters.sort === "priority") {
      items.sort((a, b) => {
        const scoreA = severityRank[a.severity] || 0;
        const scoreB = severityRank[b.severity] || 0;
        if (scoreA !== scoreB) return scoreB - scoreA;
        return (b.riskScore || 0) - (a.riskScore || 0);
      });
    }

    return items;
  }, [complaints, filters]);

  useEffect(() => {
    if (!selected) return;
    const stillVisible = filteredComplaints.some(
      (item) => item.complaintId === selected.complaintId
    );
    if (!stillVisible) {
      setSelected(null);
    }
  }, [filteredComplaints, selected]);

  const statusCounts = useMemo(() => {
    return complaints.reduce((acc, complaint) => {
      const key = complaint.status || "Submitted";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [complaints]);

  return (
    <div className="space-y-6">
      {/* --- Dashboard Statistics --- */}
      <div className="rounded-xl border border-border bg-navy text-white shadow-card">
        <div className="border-l-4 border-accent px-6 py-6">
          <p className="small-caps text-white/70">My Dashboard</p>
          <h2 className="mt-2 font-serif text-2xl">Complaint History and Tracking</h2>
          <p className="mt-2 text-sm text-white/70">
            Monitor your complaints, track resolution progress, and review status updates.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={stats.total} accent />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="In Progress" value={stats.inProgress} />
        <StatCard label="Resolved" value={stats.resolved} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
        <aside className="flex flex-col gap-6 rounded-xl border border-border bg-white/80 p-6 shadow-card">
          <div>
            <p className="small-caps text-ink/60">Navigation</p>
            <h3 className="mt-2 font-serif text-xl">My Complaints</h3>
          </div>

          <nav className="space-y-2 text-sm text-ink/70">
            <a className="block rounded-md border border-border bg-white px-4 py-2" href="#/dashboard">
              Dashboard Overview
            </a>
            <a className="block rounded-md border border-border bg-white px-4 py-2" href="#/report">
              Report New Issue
            </a>
            <div className="rounded-md border border-accent/40 bg-accent/10 px-4 py-2 font-semibold text-ink">
              Complaint History
            </div>
          </nav>

          <div className="space-y-3">
            <p className="small-caps text-ink/60">Filters</p>
            <div className="grid gap-3 text-xs text-ink/70">
              <label className="uppercase tracking-[0.12em]">Search</label>
              <div className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2">
                <FiSearch className="text-ink/50" />
                <input
                  className="w-full text-sm text-ink outline-none"
                  placeholder="Search complaints"
                  value={filters.search}
                  onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                />
              </div>

              <label className="uppercase tracking-[0.12em]">Status</label>
              <select
                className="w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
                value={filters.status}
                onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <label className="uppercase tracking-[0.12em]">Road Type</label>
              <select
                className="w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
                value={filters.roadType}
                onChange={(event) => setFilters((prev) => ({ ...prev, roadType: event.target.value }))}
              >
                {roadTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <label className="uppercase tracking-[0.12em]">District</label>
              <select
                className="w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
                value={filters.district}
                onChange={(event) => setFilters((prev) => ({ ...prev, district: event.target.value }))}
              >
                {districtOptions.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>

              <label className="uppercase tracking-[0.12em]">Sort By</label>
              <select
                className="w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
                value={filters.sort}
                onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="priority">Priority and severity</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white px-4 py-4 text-xs text-ink/70">
            <div className="flex items-center gap-2 text-ink/60">
              <FiFilter /> Active Status Mix
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <StatusBadge status={status} />
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="rounded-xl border border-border bg-white shadow-card">
            <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
              My Complaint Registry
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 text-sm text-ink/70">
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-ink/50">Showing</p>
                <p className="mt-1 text-ink">{filteredComplaints.length} complaints</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md border border-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-navy transition hover:border-accent hover:text-accent"
                onClick={fetchComplaints}
                disabled={loading}
              >
                <FiRefreshCw /> {loading ? "Refreshing" : "Refresh"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-xl border border-border bg-white shadow-card"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : filteredComplaints.length ? (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.complaintId}
                  complaint={complaint}
                  active={selected?.complaintId === complaint.complaintId}
                  onSelect={setSelected}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-white px-4 py-4 text-sm text-ink/60">
              No complaints found. Start by reporting a road issue.
            </div>
          )}
        </section>

        <ComplaintDetailPanel complaint={selected} loading={loading} />
      </div>
    </div>
  );
};

export default ComplaintHistoryPage;
