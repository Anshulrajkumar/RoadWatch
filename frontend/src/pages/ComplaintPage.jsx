import { useState } from "react";
import Header from "../components/Header.jsx";

const categories = [
  { id: "pothole", label: "Pothole" },
  { id: "street-light", label: "Street Light" },
  { id: "drainage", label: "Drainage" },
  { id: "signage", label: "Signage" },
];

const urgencyOptions = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

const ComplaintPage = ({ onNavigate, onBrandClick, activePage }) => {
  const [category, setCategory] = useState("pothole");
  const [urgency, setUrgency] = useState("medium");

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header activePage={activePage} onNavigate={onNavigate} onBrandClick={onBrandClick} />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="max-w-3xl">
          <p className="small-caps text-ink/60">Report an issue</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Report an Issue</h2>
          <p className="mt-3 text-base leading-7 text-ink/68">
            Select an issue category below to begin your report. Accurate reporting helps us maintain safer roads.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`rounded-2xl border px-4 py-6 text-center text-sm font-semibold transition ${
                category === item.id
                  ? "border-navy bg-[#eef3fb] text-navy"
                  : "border-border bg-white text-ink/70 hover:border-[#c7cfda]"
              }`}
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#e9effa] text-base">[]</div>
              {item.label}
            </button>
          ))}
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between bg-navy px-6 py-4 text-white">
            <h3 className="text-lg font-semibold">Complaint Details</h3>
            <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1b2230]">
              {categories.find((item) => item.id === category)?.label || "Category"}
            </span>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Location</p>
              <div className="mt-4 space-y-4">
                <button className="w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold text-ink/80 transition hover:border-[#b8c7de]">
                  Use Current Location
                </button>
                <div className="text-xs uppercase tracking-[0.18em] text-ink/50">Or enter manually</div>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none"
                  placeholder="Landmark or Address"
                />
                <div className="flex h-36 items-center justify-center rounded-xl border border-border bg-[#d9e3f4] text-lg font-semibold text-[#9aa8c0]">
                  Map Preview
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Evidence & Description</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-ink/60">
                  Click to upload or drag and drop
                  <div className="mt-2 text-xs text-ink/50">JPG, PNG up to 5MB</div>
                </div>
                <textarea
                  className="min-h-28 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none"
                  placeholder="Provide details about the issue..."
                />
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-ink/50">Assessment</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {urgencyOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setUrgency(option.id)}
                    className={`rounded-xl border px-5 py-2 text-sm font-semibold transition ${
                      urgency === option.id
                        ? "border-[#b65620] bg-[#ffe9db] text-[#7a2f06]"
                        : "border-border text-ink/70 hover:border-[#b8c7de]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-ink/80">
                Cancel
              </button>
              <button className="rounded-xl bg-[#9a4a00] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white">
                Submit Report
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ComplaintPage;