import { useEffect, useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import ComplaintHistoryPage from "./pages/ComplaintHistoryPage.jsx";

const App = () => {
  const [route, setRoute] = useState(() => window.location.hash || "#/dashboard");

  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash || "#/dashboard";
      setRoute(hash);
    };

    handleRoute();
    window.addEventListener("hashchange", handleRoute);
    return () => window.removeEventListener("hashchange", handleRoute);
  }, []);

  const showReport = route.startsWith("#/report");
  const showComplaints = route.startsWith("#/complaints");

  return (
    <DashboardLayout>
      {showReport ? <ReportIssue /> : showComplaints ? <ComplaintHistoryPage /> : <Dashboard />}
    </DashboardLayout>
  );
};

export default App;
