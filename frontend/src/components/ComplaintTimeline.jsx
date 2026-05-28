import { FiCheckCircle, FiClock, FiCircle, FiAlertTriangle } from "react-icons/fi";
import TrackingProgressBar from "./TrackingProgressBar.jsx";

const getStepState = (step) => {
  if (step?.current) return "current";
  if (step?.completed) return "completed";
  return "pending";
};

const getStepStyle = (state) => {
  if (state === "completed") {
    return {
      icon: "text-emerald-600",
      badge: "border-emerald-200 bg-emerald-50",
      text: "text-emerald-700",
    };
  }

  if (state === "current") {
    return {
      icon: "text-accent",
      badge: "border-accent/30 bg-accent/15",
      text: "text-accent",
    };
  }

  return {
    icon: "text-slate-400",
    badge: "border-border bg-white",
    text: "text-ink/60",
  };
};

const ComplaintTimeline = ({ timeline }) => {
  const steps = Array.isArray(timeline) ? timeline : [];

  if (!steps.length) {
    return (
      <div className="rounded-lg border border-border bg-white px-4 py-4 text-xs text-ink/60">
        Timeline data is not available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TrackingProgressBar steps={steps} />
      <div className="rounded-lg border border-border bg-white px-4 py-4">
        <p className="text-xs uppercase tracking-[0.14em] text-ink/60">Status Timeline</p>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const state = getStepState(step);
            const style = getStepStyle(state);
            const Icon =
              state === "completed"
                ? FiCheckCircle
                : state === "current"
                  ? FiClock
                  : step?.flagged
                    ? FiAlertTriangle
                    : FiCircle;

            return (
              <div
                key={`${step.stage}-${index}`}
                className={`min-w-[220px] rounded-lg border px-4 py-3 ${style.badge}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full border ${style.badge} ${style.icon}`}>
                    <Icon className={state === "current" ? "animate-pulse" : ""} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{step.stage}</p>
                    {step.actor ? <p className="text-xs text-ink/60">{step.actor}</p> : null}
                  </div>
                </div>
                {step.timestamp ? (
                  <p className={`mt-2 text-xs ${style.text}`}>{new Date(step.timestamp).toLocaleString()}</p>
                ) : (
                  <p className="mt-2 text-xs text-ink/40">Pending</p>
                )}
                {step.note ? <p className="mt-2 text-xs text-ink/60">{step.note}</p> : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComplaintTimeline;
