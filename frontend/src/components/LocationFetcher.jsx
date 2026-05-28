const LocationFetcher = ({ coords, loading, error, onLocate }) => {
  return (
    <div className="rounded-xl border border-border bg-white shadow-card">
      <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
        GPS Detection
      </div>
      <div className="space-y-4 px-6 py-5">
        <button
          type="button"
          className="w-full rounded-md bg-navy px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white shadow-soft transition hover:bg-navy-deep"
          onClick={onLocate}
          disabled={loading}
        >
          {loading ? "Detecting Location..." : "Fetch Live GPS Location"}
        </button>

        <div className="rounded-lg border border-border bg-white px-4 py-3 text-xs text-ink/70">
          {coords ? (
            <div className="space-y-1">
              <span className="block">Lat: {coords.lat.toFixed(6)}</span>
              <span className="block">Lng: {coords.lng.toFixed(6)}</span>
            </div>
          ) : (
            "Coordinates will appear after GPS detection."
          )}
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LocationFetcher;
