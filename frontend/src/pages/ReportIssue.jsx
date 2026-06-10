import { useState } from "react";
import ReportIssueForm from "../components/ReportIssueForm.jsx";
import UploadPreview from "../components/UploadPreview.jsx";
import RoadInfoCard from "../components/RoadInfoCard.jsx";
import SeverityCard from "../components/SeverityCard.jsx";
import ComplaintSummary from "../components/ComplaintSummary.jsx";

const ReportIssue = ({ onNavigate }) => {
  const [preview, setPreview] = useState(null);
  const [coords, setCoords] = useState(null);
  const [roadInfo, setRoadInfo] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState({ submitting: false, progress: 0, error: null });

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
            onNavigate={onNavigate}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
