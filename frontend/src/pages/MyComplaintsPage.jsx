import { useMemo, useState } from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const complaintsData = [
  {
    id: "RW-COMP-8821",
    title: "Deep Pothole on NH-44",
    location: "Jabalpur Bypass, Madhya Pradesh",
    status: "Under Review",
    statusTone: "bg-[#f7d46a] text-[#3a2d00]",
    date: "Oct 24, 2023",
    category: "Surface Damage",
    priority: "High",
    description:
      "Near milestone 45, northbound lanes. Large pothole causing vehicles to swerve dangerously into adjacent lanes.",
    coords: "Lat: 23.195781, Lng: 79.954366",
  },
  {
    id: "RW-COMP-7104",
    title: "Damaged Divider",
    location: "State Highway 22, Katni Route",
    status: "Resolved",
    statusTone: "bg-[#c6f1d6] text-[#0f3d22]",
    date: "Sep 12, 2023",
    category: "Barrier Damage",
    priority: "Medium",
    description:
      "Divider section collapsed after heavy rainfall. Emergency repair completed and cleared for traffic.",
    coords: "Lat: 23.859900, Lng: 80.394900",
  },
  {
    id: "RW-COMP-9012",
    title: "Faded Lane Markings",
    location: "City Center, Jabalpur",
    status: "Submitted",
    statusTone: "bg-[#dfe6f3] text-[#1f2a44]",
    date: "Nov 02, 2023",
    category: "Road Marking",
    priority: "Low",
    description:
      "Lane markings not visible at night near intersection. Request repainting for safety compliance.",
    coords: "Lat: 23.176500, Lng: 79.942100",
  },
];

const MyComplaintsPage = ({ activePage, onNavigate, onBrandClick }) => {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(complaintsData[0]?.id || "");

  const filteredComplaints = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return complaintsData;
    }

    return complaintsData.filter((complaint) => {
      return (
        complaint.id.toLowerCase().includes(normalized) ||
        complaint.title.toLowerCase().includes(normalized) ||
        complaint.location.toLowerCase().includes(normalized)
      );
    });
  }, [query]);

  const selectedComplaint =
    filteredComplaints.find((complaint) => complaint.id === selectedId) || filteredComplaints[0];

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header activePage={activePage} onNavigate={onNavigate} onBrandClick={onBrandClick} />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="max-w-3xl">
          <p className="small-caps text-ink/60">My complaints</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">My Complaints</h2>
          <p className="mt-3 text-base leading-7 text-ink/68">
            Track the status of your reported road issues and keep submissions aligned with review progress.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section className="space-y-4">
            <div className="rounded-xl border border-border bg-white px-4 py-3 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-3 text-sm text-ink/70">
                <span className="text-base">🔍</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by complaint ID or location"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/40"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <button
                  key={complaint.id}
                  type="button"
                  onClick={() => setSelectedId(complaint.id)}
                  className={`w-full rounded-xl border border-border bg-white p-4 text-left shadow-[0_8px_22px_rgba(15,23,42,0.05)] transition hover:border-[#b8c7de] ${
                    selectedComplaint?.id === complaint.id ? "ring-1 ring-accent/40" : ""
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-ink/60">
                    <span>ID: {complaint.id}</span>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${complaint.statusTone}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-ink">{complaint.title}</h3>
                  <p className="mt-2 text-sm text-ink/65">{complaint.location}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-ink/60">
                    <span>Reported on {complaint.date}</span>
                    <span className="font-semibold text-ink">View details →</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {selectedComplaint ? (
            <section className="rounded-xl border border-border bg-white shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
              <div className="border-b border-border bg-navy px-5 py-4 text-white">
                <div className="flex items-center justify-between">
                  <p className="small-caps text-white/70">Complaint detail</p>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${selectedComplaint.statusTone}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
                <h3 className="mt-3 text-2xl font-semibold leading-tight">{selectedComplaint.title}</h3>
              </div>

              <div className="grid gap-4 px-5 py-5 text-sm text-ink/70 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Complaint ID</p>
                  <p className="mt-2 font-semibold text-ink">{selectedComplaint.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Date Reported</p>
                  <p className="mt-2 font-semibold text-ink">{selectedComplaint.date}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Category</p>
                  <p className="mt-2 font-semibold text-ink">{selectedComplaint.category}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Priority</p>
                  <p className="mt-2 font-semibold text-ink">{selectedComplaint.priority}</p>
                </div>
              </div>

              <div className="px-5 pb-5">
                <div className="rounded-xl border border-border bg-[#f5f7fb] p-4">
                  <p className="text-sm font-semibold text-ink">{selectedComplaint.location}</p>
                  <p className="mt-2 text-xs text-ink/60">{selectedComplaint.coords}</p>
                  <p className="mt-3 text-sm text-ink/70">{selectedComplaint.description}</p>
                </div>
              </div>

              <div className="border-t border-border px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Submitted evidence</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="flex h-28 items-center justify-center rounded-xl border border-border bg-[#eef2f8] text-ink/50">
                    Photo
                  </div>
                  <div className="flex h-28 items-center justify-center rounded-xl border border-border bg-[#eef2f8] text-ink/50">
                    Additional
                  </div>
                </div>
              </div>

              <div className="border-t border-border px-5 py-5">
                <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Resolution timeline</p>
                <div className="mt-4 space-y-4">
                  {[
                    {
                      title: "Inspection Scheduled",
                      time: "Oct 26, 2023 - 09:00 AM",
                      detail: "Assigned to field engineer for site assessment.",
                    },
                    {
                      title: "Initial Review Completed",
                      time: "Oct 25, 2023 - 01:30 PM",
                      detail: "Complaint verified and forwarded to PWD division.",
                    },
                    {
                      title: "Complaint Submitted",
                      time: "Oct 24, 2023 - 11:15 AM",
                      detail: "System recorded complaint and issued tracking ID.",
                    },
                  ].map((step) => (
                    <div key={step.title} className="flex gap-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-accent" />
                      <div>
                        <p className="text-sm font-semibold text-ink">{step.title}</p>
                        <p className="text-xs text-ink/60">{step.time}</p>
                        <p className="text-sm text-ink/70">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyComplaintsPage;