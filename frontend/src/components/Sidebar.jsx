import { useEffect, useState } from "react";

const roadTypes = [
  { code: "NH", label: "National Highway (NH)", color: "bg-[#f28c28]" },
  { code: "SH", label: "State Highway (SH)", color: "bg-[#f2c94c]" },
  { code: "MDR", label: "Major District Road (MDR)", color: "bg-[#3a9b5c]" },
];

const Sidebar = ({ onUseLocation, onSubmitCoords, loading, coords, error }) => {
  const [draftLat, setDraftLat] = useState("");
  const [draftLng, setDraftLng] = useState("");
  const [draftError, setDraftError] = useState(null);

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

  return (
    <aside className="flex flex-col gap-6 rounded-xl border border-border bg-white/80 p-6 shadow-card">
      <div>
        <p className="small-caps text-ink/60">Live Tracking</p>
        <h2 className="mt-2 font-serif text-2xl">Live Tracking</h2>
      </div>

      <button
        className="w-full rounded-md bg-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-soft transition hover:bg-navy-deep"
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

      <div className="space-y-3">
        <p className="small-caps text-ink/60">Manual Coordinates</p>
        <div className="grid gap-3 text-xs text-ink/70">
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
            className="w-full border border-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-navy transition hover:border-accent hover:text-accent"
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
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="small-caps text-ink/60">Road Types Near You</p>
        <div className="space-y-2">
          {roadTypes.map((type) => (
            <div
              key={type.code}
              className="flex items-center gap-3 rounded-md border border-border bg-white px-3 py-2 text-sm"
            >
              <span className={`h-3 w-3 rounded-full ${type.color}`} />
              <span className="text-ink/80">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full rounded-md border border-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-navy transition hover:border-accent hover:text-accent">
        Reset Filters
      </button>
    </aside>
  );
};

export default Sidebar;
