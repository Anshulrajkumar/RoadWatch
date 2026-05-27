import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import { useMemo } from "react";
import L from "leaflet";

const ComplaintMap = ({ coords }) => {
  const markerIcon = useMemo(
    () =>
      L.divIcon({
        className: "rw-marker-target",
        html: "",
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    []
  );

  if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) {
    return (
      <div className="rounded-lg border border-border bg-white px-4 py-4 text-xs text-ink/60">
        Map preview is unavailable for this complaint.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-card">
      <div className="border-b border-border bg-navy px-6 py-3 text-xs uppercase tracking-[0.14em] text-white/80">
        Location Map
      </div>
      <div className="rw-map-tint h-[260px] w-full">
        <MapContainer center={[coords.lat, coords.lng]} zoom={13} zoomControl={false}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <Marker position={[coords.lat, coords.lng]} icon={markerIcon} />
        </MapContainer>
      </div>
    </div>
  );
};

export default ComplaintMap;
