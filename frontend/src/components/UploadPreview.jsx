import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import { useMemo } from "react";
import L from "leaflet";

const UploadPreview = ({ preview, coords, road, submitting }) => {
  const fallbackCenter = { lat: 22.9734, lng: 78.6569 };
  const center = coords || fallbackCenter;

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
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-white px-6 py-3">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-ink/60">
            Upload Preview
            {road?.roadCode ? (
              <span className="rounded-full border border-border px-3 py-1 text-[11px] text-ink/60">
                {road.roadCode}
              </span>
            ) : null}
          </div>
        </div>

        <div className="relative flex h-[280px] items-center justify-center bg-muted md:h-[320px] xl:h-[360px]">
          {preview?.url ? (
            preview.type === "video" ? (
              <video
                className="h-full w-full object-cover"
                src={preview.url}
                controls
                muted
                preload="metadata"
              />
            ) : (
              <img className="h-full w-full object-cover" src={preview.url} alt="Uploaded preview" />
            )
          ) : (
            <div className="text-sm text-ink/60">Upload an image or video to preview.</div>
          )}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-white/60 px-6 py-2 text-xs uppercase tracking-[0.2em] text-white/90">
              AI Detection Overlay
            </div>
          </div>
        </div>
      </section>

      <button
        type="submit"
        form="report-issue-form"
        className="w-full rounded-md bg-[#b91c1c] px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-soft transition hover:bg-[#991b1b]"
        disabled={submitting}
      >
        {submitting ? "Submitting Complaint..." : "Submit Complaint"}
      </button>

      <section className="relative overflow-hidden rounded-xl border border-border bg-white shadow-card">
        <div className="border-b border-border bg-white px-6 py-3">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-ink/60">
            Road Context Map
            <span className="rounded-full bg-navy px-3 py-1 text-[11px] text-white/80">
              {coords ? "Live GPS" : "National Overview"}
            </span>
          </div>
        </div>

        <div className="rw-map-tint h-[360px] w-full md:h-[420px] xl:h-[520px]">
          <MapContainer center={[center.lat, center.lng]} zoom={coords ? 13 : 5} zoomControl={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />
            {coords ? <Marker position={[coords.lat, coords.lng]} icon={targetMarkerIcon} /> : null}
          </MapContainer>
        </div>
      </section>
    </div>
  );
};

export default UploadPreview;
