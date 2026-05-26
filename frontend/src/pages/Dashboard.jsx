import Sidebar from "../components/Sidebar.jsx";
import MapView from "../components/MapView.jsx";
import RoadDetailsPanel from "../components/RoadDetailsPanel.jsx";
import { useRoadData } from "../hooks/useRoadData";

const Dashboard = () => {
  const { coords, roadData, loading, error, lastUpdated, useMyLocation, fetchByCoords } = useRoadData();

  const fallbackCenter = { lat: 22.9734, lng: 78.6569 };
  const mapCenter = coords || fallbackCenter;

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
      <Sidebar
        onUseLocation={useMyLocation}
        onSubmitCoords={fetchByCoords}
        loading={loading}
        coords={coords}
        error={error}
      />
      <MapView center={mapCenter} coords={coords} loading={loading} roadData={roadData} />
      <RoadDetailsPanel roadData={roadData} loading={loading} lastUpdated={lastUpdated} />
    </div>
  );
};

export default Dashboard;
