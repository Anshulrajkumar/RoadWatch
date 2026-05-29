import { useEffect, useState } from "react";
import ReportIssueForm from "../components/ReportIssueForm.jsx";
import UploadPreview from "../components/UploadPreview.jsx";
import RoadInfoCard from "../components/RoadInfoCard.jsx";
import SeverityCard from "../components/SeverityCard.jsx";
import ComplaintSummary from "../components/ComplaintSummary.jsx";
import ComplaintHistory from "../components/ComplaintHistory.jsx";
import { getComplaintHistory } from "../services/api";

const ReportIssue = () => {
  const historyLimit = 8;
  const [preview, setPreview] = useState(null);
  const [coords, setCoords] = useState(null);
  const [roadInfo, setRoadInfo] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState({ submitting: false, progress: 0, error: null });
  const [history, setHistory] = useState([]);
  const [historyStatus, setHistoryStatus] = useState({ loading: true, error: null });

  const fetchHistory = async () => {
    setHistoryStatus({ loading: true, error: null });
    try {
      const response = await getComplaintHistory(historyLimit);
      setHistory(response?.complaints || []);
      setHistoryStatus({ loading: false, error: null });
    } catch (error) {
      setHistoryStatus({
        loading: false,
        error: error?.message || "Unable to load complaint history.",
      });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (!complaint) return;
    setHistory((prev) => {
      const next = [complaint, ...prev.filter((item) => item.complaintId !== complaint.complaintId)];
      return next.slice(0, historyLimit);
    });
  }, [complaint, historyLimit]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold uppercase tracking-[0.18em] text-center text-ink/60">
            Complain Details
          </p>
          <ReportIssueForm
            onPreviewChange={setPreview}
            onLocationChange={setCoords}
            onRoadInfoChange={setRoadInfo}
            onAiInsight={setAiInsight}
            onComplaint={setComplaint}
            onStatusChange={setStatus}
          />
        </div>

        <UploadPreview preview={preview} coords={coords} road={roadInfo} submitting={status.submitting} />

        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold uppercase tracking-[0.18em] text-center text-ink/60">
            Complain Analysis
          </p>
          <div className="flex flex-col gap-6">
            <RoadInfoCard road={roadInfo} coords={coords} />
            <SeverityCard insight={aiInsight} loading={status.submitting} />
            <ComplaintSummary complaint={complaint} />
            <ComplaintHistory
              complaints={history}
              loading={historyStatus.loading}
              error={historyStatus.error}
              onRefresh={fetchHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
