import { useEffect, useState } from "react";

const Sidebar = ({ onUseLocation, onSubmitRoadName, onSubmitCoords, loading, coords, error }) => {
  const [draftLat, setDraftLat] = useState("");
  const [draftLng, setDraftLng] = useState("");
  const [draftRoadName, setDraftRoadName] = useState("");
  const [draftError, setDraftError] = useState(null);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    if (coords) {
      setDraftLat(String(coords.lat));
      setDraftLng(String(coords.lng));
    }
  }, [coords]);

  const handleSubmit = () => {
    const lat = Number.parseFloat(draftLat);
    const lng = Number.parseFloat(draftLng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setDraftError("Enter valid latitude and longitude values.");
      return;
    }

    setDraftError(null);
    onSubmitCoords(lat, lng);
  };

  const handleRoadSearch = () => {
    const roadName = draftRoadName.trim();
    if (roadName.length < 2) {
      setSearchError("Enter at least 2 characters for road name.");
      return;
    }

    setSearchError(null);
    onSubmitRoadName(roadName);
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base font-semibold uppercase tracking-[0.18em] text-center text-ink/60">
        Live Tracking
      </p>

      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-border bg-white shadow-card">
          <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
            Live Tracking
          </div>
          <div className="space-y-4 px-6 py-5">
            <button
              className="w-full rounded-none bg-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-soft transition hover:bg-navy-deep"
              onClick={onUseLocation}
              disabled={loading}
            >
              {loading ? "Locating..." : "Use My Location"}
            </button>

            {coords ? (
              <div className="rounded-lg border border-border bg-white px-4 py-3 text-xs text-ink/70">
                <span className="block">Lat: {coords.lat.toFixed(6)}</span>
                <span className="block">Lng: {coords.lng.toFixed(6)}</span>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-white px-4 py-3 text-xs text-ink/60">
                Coordinates will appear here after location fetch.
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
          <span className="h-px flex-1 bg-border" />
          <span>Or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-xl border border-border bg-white shadow-card">
          <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
            Search by Road Name
          </div>
          <div className="grid gap-3 px-6 py-5 text-xs text-ink/70">
            <label className="uppercase tracking-[0.12em]">Road Name</label>
            <input
              className="w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
              value={draftRoadName}
              onChange={(event) => setDraftRoadName(event.target.value)}
              placeholder="Enter road name (for example NH44)"
            />
            <button
              className="w-full rounded-none bg-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-soft transition hover:bg-navy-deep"
              onClick={handleRoadSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search by Name"}
            </button>
            {searchError ? (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                {searchError}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
          <span className="h-px flex-1 bg-border" />
          <span>Or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-xl border border-border bg-white shadow-card">
          <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
            Manual Coordinates
          </div>
          <div className="grid gap-3 px-6 py-5 text-xs text-ink/70">
            <label className="uppercase tracking-[0.12em]">Latitude</label>
            <input
              className="w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
              value={draftLat}
              onChange={(event) => setDraftLat(event.target.value)}
              placeholder="Enter latitude"
            />
            <label className="uppercase tracking-[0.12em]">Longitude</label>
            <input
              className="w-full border border-border bg-white px-3 py-2 text-sm text-ink outline-none"
              value={draftLng}
              onChange={(event) => setDraftLng(event.target.value)}
              placeholder="Enter longitude"
            />
            <button
              className="w-full rounded-none bg-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-soft transition hover:bg-navy-deep"
              onClick={handleSubmit}
              disabled={loading}
            >
              Fetch by Coordinates
            </button>
            {draftError ? (
              <div className="border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                {draftError}
              </div>
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-xs text-red-700 shadow-card">
            {error}
          </div>
        ) : null}

        <div className="rounded-xl border border-border bg-white shadow-card">
          <div className="px-6 py-5">
            <button className="w-full rounded-md border border-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-navy transition hover:border-accent hover:text-accent">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <a
        href="#/report"
        className="hidden w-full rounded-lg bg-[#b91c1c] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-soft transition hover:bg-[#991b1b] xl:block"
      >
        Report an Issue
      </a>
    </div>
  );
};

export default Sidebar;
