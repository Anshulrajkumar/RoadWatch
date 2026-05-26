const StatsCard = ({ label, value }) => {
  return (
    <div className="rounded-lg border border-border bg-white/90 px-4 py-3 text-center shadow-card">
      <p className="text-xs uppercase tracking-[0.14em] text-ink/60">{label}</p>
      <p className="mt-2 font-serif text-2xl text-ink">{value}</p>
    </div>
  );
};

export default StatsCard;
