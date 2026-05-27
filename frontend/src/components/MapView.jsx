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

const MapView = ({ center, userCoords, targetCoords, loading, roadData }) => {
  const userMarkerIcon = useMemo(
    () =>
      L.divIcon({
        className: "rw-marker-user",
        html: "",
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    []
  );

  const targetMarkerIcon = useMemo(
    () =>
      L.divIcon({
        className: "rw-marker-target",
        html: "",
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    []
  );

  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-white shadow-card">
      <div className="absolute right-6 top-6 z-[500] rounded-full bg-white/80 px-4 py-2 text-xs text-ink/70 shadow-card">
        {loading ? "Fetching road intelligence..." : roadData?.road?.roadCode || "Live road intelligence"}
      </div>

      <div className="border-b border-border bg-white px-6 py-3">
        <div className="flex flex-wrap items-center gap-5 text-xs text-ink/70">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-white bg-[#dc2626] shadow-[0_0_0_3px_rgba(220,38,38,0.2)]" />
            Your Location
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full border border-white bg-[#111827] shadow-[0_0_0_3px_rgba(17,24,39,0.15)]" />
            Searched Location
          </span>
        </div>
      </div>

      <div className="rw-map-tint h-[620px] w-full">
        <MapContainer center={[center.lat, center.lng]} zoom={6} zoomControl={false}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          <MapUpdater center={center} />
          {userCoords ? <Marker position={[userCoords.lat, userCoords.lng]} icon={userMarkerIcon} /> : null}
          {targetCoords ? <Marker position={[targetCoords.lat, targetCoords.lng]} icon={targetMarkerIcon} /> : null}
        </MapContainer>
      </div>
    </section>
  );
};

export default MapView;
