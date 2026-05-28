import { motion } from "framer-motion";
import { FiCheck, FiLoader, FiCircle } from "react-icons/fi";

const getStepState = (step) => {
  if (step?.current) return "current";
  if (step?.completed) return "completed";
  return "pending";
};

const TrackingProgressBar = ({ steps }) => {
  const timeline = Array.isArray(steps) ? steps : [];
  const totalSteps = timeline.length;
  const lastIndex = totalSteps - 1;

  const currentIndex = timeline.findIndex((step) => step.current);
  const completedIndex = timeline.reduce((acc, step, index) => (step.completed ? index : acc), -1);
  const progressIndex = Math.max(currentIndex, completedIndex, 0);
  const progressPercent = totalSteps > 1 ? (progressIndex / lastIndex) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-0 right-0 top-5 h-1 rounded-full bg-muted" />
        <motion.div
          className="absolute left-0 top-5 h-1 rounded-full bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6 }}
        />
        <div className="relative grid grid-cols-5 gap-2">
          {timeline.map((step, index) => {
            const state = getStepState(step);
            const Icon = state === "completed" ? FiCheck : state === "current" ? FiLoader : FiCircle;
            const ring =
              state === "completed"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : state === "current"
                  ? "border-accent/40 bg-accent/15 text-accent"
                  : "border-border bg-white text-ink/40";

            return (
              <div key={step.stage} className="flex flex-col items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border ${ring} ${
                    state === "current" ? "animate-pulse" : ""
                  }`}
                >
                  <Icon className={state === "current" ? "animate-spin" : ""} />
                </span>
                <p className="text-center text-[11px] uppercase tracking-[0.12em] text-ink/60">{step.stage}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-ink/60">
        <span>Progress</span>
        <span>{Math.round(progressPercent)}% complete</span>
      </div>
    </div>
  );
};

export default TrackingProgressBar;
