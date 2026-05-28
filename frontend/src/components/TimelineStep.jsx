import { FiCheckCircle, FiClock, FiCircle, FiAlertTriangle } from "react-icons/fi";

const getStepState = (step) => {
  if (step?.current) return "current";
  if (step?.completed) return "completed";
  return "pending";
};

const TimelineStep = ({ step, isLast }) => {
  const state = getStepState(step);
  const Icon =
    state === "completed" ? FiCheckCircle : state === "current" ? FiClock : step?.flagged ? FiAlertTriangle : FiCircle;
  const tone =
    state === "completed"
      ? "text-emerald-600"
      : state === "current"
        ? "text-accent"
        : "text-slate-400";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white ${tone}`}>
          <Icon className={state === "current" ? "animate-pulse" : ""} />
        </span>
        {!isLast ? <span className="mt-2 h-full w-px bg-border" /> : null}
      </div>
      <div className="pb-4">
        <p className="text-sm font-semibold text-ink">{step.stage}</p>
        {step.actor ? <p className="text-xs text-ink/60">{step.actor}</p> : null}
        {step.timestamp ? (
          <p className="mt-1 text-xs text-ink/50">{new Date(step.timestamp).toLocaleString()}</p>
        ) : (
          <p className="mt-1 text-xs text-ink/40">Pending</p>
        )}
        {step.note ? <p className="mt-2 text-xs text-ink/60">{step.note}</p> : null}
      </div>
    </div>
  );
};

export default TimelineStep;
