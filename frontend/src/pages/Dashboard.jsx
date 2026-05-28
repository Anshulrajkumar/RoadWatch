import Sidebar from "../components/Sidebar.jsx";
import MapView from "../components/MapView.jsx";
import RoadDetailsPanel from "../components/RoadDetailsPanel.jsx";
import { useRoadData } from "../hooks/useRoadData";

const Dashboard = ({ onNavigate }) => {
  const { userCoords, coords, roadData, loading, error, lastUpdated, useMyLocation, fetchByCoords, fetchByRoadName } = useRoadData();

  const fallbackCenter = { lat: 22.9734, lng: 78.6569 };
  const mapCenter = coords || userCoords || fallbackCenter;

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
      <Sidebar
        onUseLocation={useMyLocation}
        onSubmitRoadName={fetchByRoadName}
        onSubmitCoords={fetchByCoords}
        loading={loading}
        coords={coords}
        error={error}
      />
      <div>
        <div className="mb-6 flex justify-center">
          <div className="w-full max-w-xl px-4">
            <button
              type="button"
              onClick={() => onNavigate?.("/report")}
              className="mx-auto block w-full rounded-xl bg-accent px-8 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-soft transition hover:bg-accent-soft"
            >
              Report an Issue
            </button>
          </div>
        </div>

        <MapView
          center={mapCenter}
          userCoords={userCoords}
          targetCoords={coords}
          loading={loading}
          roadData={roadData}
        />
      </div>
      <RoadDetailsPanel roadData={roadData} loading={loading} lastUpdated={lastUpdated} />
    </div>
  );
};

export default Dashboard;
