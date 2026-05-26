import { MapContainer, Marker, TileLayer, ZoomControl, useMap } from "react-leaflet";
import { useEffect, useMemo } from "react";
import L from "leaflet";

const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], 12, { animate: true });
    }
  }, [center, map]);

  return null;
};

const MapView = ({ center, coords, loading, roadData }) => {
  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "rw-marker",
        html: "",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    []
  );

  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-white shadow-card">
      <div className="absolute left-6 bottom-6 z-[500] rounded-lg bg-navy px-5 py-3 text-xs text-white shadow-soft">
        <p className="small-caps text-white/70">Map Legend</p>
        <div className="mt-3 flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" /> Completed
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" /> In Progress
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/40" /> Scheduled
          </span>
        </div>
      </div>

      <div className="absolute right-6 top-6 z-[500] rounded-full bg-white/80 px-4 py-2 text-xs text-ink/70 shadow-card">
        {loading ? "Fetching road intelligence..." : roadData?.road?.roadCode || "Live road intelligence"}
      </div>

      <div className="rw-map-tint h-[620px] w-full">
        <MapContainer center={[center.lat, center.lng]} zoom={6} zoomControl={false}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <MapUpdater center={center} />
          {coords ? <Marker position={[coords.lat, coords.lng]} icon={markerIcon} /> : null}
        </MapContainer>
      </div>
    </section>
  );
};

export default MapView;
