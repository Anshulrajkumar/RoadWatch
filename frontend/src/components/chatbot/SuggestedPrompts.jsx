import { motion } from "framer-motion";

const suggestions = [
  { label: "🕳️ Report a pothole", message: "How do I report a pothole?" },
  { label: "📍 Track complaint", message: "How do I track my complaint status?" },
  { label: "🔍 Search a road", message: "How do I search for a road?" },
  { label: "🛣️ NH/SH/MDR?", message: "What do NH, SH, and MDR mean?" },
  { label: "📊 Dashboard help", message: "How do I use the dashboard?" },
  { label: "💰 Budget info", message: "How can I check budget transparency for a road?" },
];

const SuggestedPrompts = ({ onSelect }) => (
  <div className="px-4 pb-2">
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
      Quick actions
    </p>
    <div className="flex flex-wrap gap-1.5">
      {suggestions.map((s) => (
        <motion.button
          key={s.label}
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(s.message)}
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 transition hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
        >
          {s.label}
        </motion.button>
      ))}
    </div>
  </div>
);

export default SuggestedPrompts;
