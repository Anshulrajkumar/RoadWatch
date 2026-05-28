import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";

const capabilities = [
  {
    title: "Real-time Road Tracking",
    description:
      "Monitor project status, classification, and live infrastructure conditions across national, state, and district road networks.",
    tone: "bg-[#d9e6ff] text-navy",
    icon: (
      <path
        d="M12 2c4.97 0 9 4.03 9 9 0 6.25-9 15-9 15S3 17.25 3 11c0-4.97 4.03-9 9-9Zm0 12.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z"
        fill="currentColor"
      />
    ),
  },
  {
    title: "Citizen Reporting",
    description:
      "Submit geotagged complaints for potholes, damaged signage, and emerging hazards with a clean issue-reporting workflow.",
    tone: "bg-[#fce5c6] text-[#b15f00]",
    icon: (
      <path
        d="M13.6 2.7 23 19.1c.8 1.4-.2 3.1-1.8 3.1H2.8c-1.6 0-2.6-1.7-1.8-3.1L10.4 2.7c.8-1.3 2.4-1.3 3.2 0ZM12 8.2c.6 0 1 .4 1 1v5.2c0 .6-.4 1-1 1s-1-.4-1-1V9.2c0-.6.4-1 1-1Zm0 10.7a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z"
        fill="currentColor"
      />
    ),
  },
  {
    title: "Infrastructure Transparency",
    description:
      "Access project snapshots, financial accountability cues, and authority ownership data in a single dashboard layer.",
    tone: "bg-[#d7e7ff] text-[#19406f]",
    icon: (
      <path
        d="M4 4.5h6v6H4v-6Zm10 0h6v6h-6v-6ZM4 13.5h6v6H4v-6Zm10 0h6v6h-6v-6Zm2-6h2v2h-2v-2Zm-10 9h2v2H6v-2Zm10 0h2v2h-2v-2ZM10 10h4v4h-4v-4Z"
        fill="currentColor"
      />
    ),
  },
];

const HeroBackdrop = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-navy" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0)_24%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.24))]" />
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:140px_140px]" />
    <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(180deg,transparent,rgba(11,26,55,0.88))]" />
  </div>
);

const capabilityMotion = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const featureShowcase = [
  {
    id: "search",
    title: "Road Search & Transparency",
    description:
      "Search roads by name, location, coordinates, or area. Reveal contractor, authority, audits, budgets, maintenance history, and live road condition intelligence in one view.",
    cta: "Explore Map",
    onAction: "map",
    visual: (
      <div className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_18px_40px_rgba(12,22,40,0.08)]">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-ink/60">
          <span>Live map preview</span>
          <span>Transparency</span>
        </div>
        <div className="mt-4 h-56 rounded-[1.25rem] border border-border bg-[#eef2f8]">
          <div className="relative h-full overflow-hidden rounded-[1.25rem]">
            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:60px_60px]" />
            <div className="absolute left-[20%] top-[62%] h-4 w-4 rounded-full border-4 border-white bg-[#111827] shadow-[0_0_0_2px_rgba(17,24,39,0.12)]" />
            <div className="absolute right-[18%] top-[28%] h-4 w-4 rounded-sm border-4 border-white bg-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.14)]" />
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/60">
              Road search
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-3 text-sm text-ink/70 sm:grid-cols-2">
          {[
            "Contractor name",
            "Responsible authority",
            "Financial audit",
            "Budget allocation",
            "Maintenance history",
            "Road condition",
          ].map((item) => (
            <div key={item} className="rounded-lg border border-border bg-white px-3 py-2">
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "complaint",
    title: "Citizen Complaint System",
    description:
      "Report potholes, damaged roads, streetlight issues, drainage problems, and construction hazards with a guided, mobile-friendly workflow.",
    cta: "Report Issue",
    onAction: "complaint",
    visual: (
      <div className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_18px_40px_rgba(12,22,40,0.08)]">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-ink/60">
          <span>Report flow</span>
          <span>Citizen first</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {["Pothole", "Street Light", "Drainage", "Signage"].map((label) => (
            <div key={label} className="rounded-xl border border-border bg-[#f6f7fb] px-4 py-6 text-center text-sm font-semibold text-ink/70">
              {label}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-border bg-white px-4 py-4 text-sm text-ink/70">
          Upload photo, tag location, and describe the issue in minutes.
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="rounded-full border border-border px-3 py-2 text-xs uppercase tracking-[0.18em] text-ink/60">GPS Tag</div>
          <button className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Submit
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "dashboard",
    title: "User Dashboard & Complaint Tracking",
    description:
      "Monitor submitted complaints, track resolution timelines, and review status badges and history in a clean, data-centric dashboard.",
    cta: "View Dashboard",
    onAction: "dashboard",
    visual: (
      <div className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_18px_40px_rgba(12,22,40,0.08)]">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-ink/60">
          <span>My complaints</span>
          <span>Status</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Resolved", value: "18" },
            { label: "In Review", value: "7" },
            { label: "Pending", value: "4" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-[#f6f7fb] px-4 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.18em] text-ink/50">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {["Deep pothole on NH-44", "Damaged divider", "Faded lane markings"].map((item) => (
            <div key={item} className="flex items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm">
              <span className="font-semibold text-ink/80">{item}</span>
              <span className="rounded-full bg-[#e7eef9] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/60">
                In review
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const previewSlides = [
  {
    key: "search",
    label: "Search",
    title: "Search by road name",
    render: () => (
      <div className="rounded-[1.5rem] border border-[#e7d9c4] bg-white p-5 text-[#1b2230] shadow-[0_18px_40px_rgba(12,22,40,0.08)]">
        <p className="small-caps text-[#1b2230]/70">Search by road name</p>
        <div className="mt-4 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#1b2230]/70">Road Name</label>
          <div className="rounded-xl border border-[#e2ddd4] bg-white px-4 py-3 text-sm text-[#1b2230]">marine drive</div>
          <button className="w-full rounded-xl border border-[#203760] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#203760]">
            Search by name
          </button>
        </div>
      </div>
    ),
  },
  {
    key: "map",
    label: "Map",
    title: "Live map view",
    render: () => (
      <div className="overflow-hidden rounded-[1.5rem] border border-[#dedede] bg-[#efefef] shadow-[0_18px_40px_rgba(12,22,40,0.08)]">
        <div className="relative h-[330px] bg-[linear-gradient(180deg,#f3f3f3,#e3e3e3)]">
          <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_20%_25%,rgba(0,0,0,0.08)_0,rgba(0,0,0,0.08)_1px,transparent_1px),radial-gradient(circle_at_60%_40%,rgba(0,0,0,0.08)_0,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:120px_120px,140px_140px,90px_90px,90px_90px]" />
          <div className="absolute left-[22%] top-[74%] h-5 w-5 rounded-full border-4 border-white bg-[#111827] shadow-[0_0_0_2px_rgba(17,24,39,0.12)]" />
          <div className="absolute right-[23%] top-[26%] h-5 w-5 rounded-sm border-4 border-white bg-[#ef4444] shadow-[0_0_0_2px_rgba(239,68,68,0.14)]" />
          <div className="absolute left-[9%] top-[15%] text-xs text-[#6b7280]">Map preview</div>
          <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-[#4b5563]">
            Live road intelligence
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "project",
    label: "Project",
    title: "Project detailed view",
    render: () => (
      <div className="rounded-[1.5rem] border border-[#d8e0ef] bg-[#11264b] p-5 text-white shadow-[0_18px_40px_rgba(12,22,40,0.1)]">
        <p className="small-caps text-white/55">Project detailed view</p>
        <h3 className="mt-3 text-3xl font-semibold tracking-tight">Marine Drive</h3>
        <p className="mt-3 text-base text-white/72">Project ID: RW-UN</p>
        <p className="mt-6 max-w-md text-sm leading-7 text-white/72">
          Marine Drive, Girgaon, D Ward, Mumbai Zone 1, Mumbai City District, Maharashtra, 400020, India
        </p>
      </div>
    ),
  },
  {
    key: "complaint",
    label: "Complaint",
    title: "Report an issue",
    render: () => (
      <div className="rounded-[1.5rem] border border-[#f0c47a] bg-white p-5 shadow-[0_18px_40px_rgba(12,22,40,0.08)]">
        <button className="w-full rounded-xl bg-accent px-4 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">
          Report an issue
        </button>
      </div>
    ),
  },
  {
    key: "classification",
    label: "Classification",
    title: "Road classification",
    render: () => (
      <div className="overflow-hidden rounded-[1.5rem] border border-[#d8e0ef] bg-white shadow-[0_18px_40px_rgba(12,22,40,0.08)]">
        <div className="bg-[#11264b] px-5 py-4 text-sm uppercase tracking-[0.22em] text-white/80">Road classification</div>
        <div className="p-5">
          <div className="flex items-center gap-3 text-base text-[#1b2230]">
            <span className="h-4 w-4 rounded-full bg-[#f2c94c]" />
            <span>State Highway</span>
          </div>
          <div className="mt-5 h-1.5 rounded-full bg-[#eceff4]">
            <div className="h-1.5 w-[68%] rounded-full bg-[#f39b19]" />
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "authority",
    label: "Authority",
    title: "Executing authority",
    render: () => (
      <div className="overflow-hidden rounded-[1.5rem] border border-[#d8e0ef] bg-white shadow-[0_18px_40px_rgba(12,22,40,0.08)]">
        <div className="bg-[#11264b] px-5 py-4 text-sm uppercase tracking-[0.22em] text-white/80">Executing authority</div>
        <div className="p-5">
          <p className="text-lg font-semibold text-[#1b2230]">Unknown</p>
          <p className="mt-2 text-sm leading-6 text-[#1b2230]/75">Girgaon, Mumbai City District, Maharashtra</p>
        </div>
      </div>
    ),
  },
];

const LandingPage = ({ onLogin, onMap, onReport, onNavigate, onBrandClick, activePage, locationHash }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!locationHash) {
      return;
    }

    const id = locationHash.replace("#", "");
    const element = document.getElementById(id);

    if (element) {
      window.requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [locationHash]);


  const scrollTo = (target) => {
    const element = document.querySelector(target);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-surface text-ink">
      <Header activePage={activePage} onNavigate={onNavigate} onBrandClick={onBrandClick} />

      <main>
        <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
          <HeroBackdrop />
          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:pb-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl text-white"
            >
              <div className="inline-flex rounded-full border border-[#e3c17b]/60 bg-white/5 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#e3c17b]">
                See your road status in one click
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-[5.5rem]">
                RoadWatch
              </h1>

              <h2 className="mt-4 max-w-4xl text-3xl font-semibold leading-[1.06] tracking-tight text-white sm:text-4xl lg:text-6xl">
                Ensuring Safe and Efficient Road Infrastructure for Every Citizen.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                A centralized platform for real-time tracking, transparent reporting, and citizen-driven accountability
                in public infrastructure maintenance.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  type="button"
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollTo("#capabilities")}
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#18202c] transition hover:bg-[#f39a32]"
                >
                  GET STARTED
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogin}
                  className="inline-flex items-center justify-center rounded-lg border border-white/32 bg-transparent px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white/45 hover:bg-white/5"
                >
                  LOG IN
                </motion.button>
              </div>

              <div className="mt-10 grid gap-4 text-sm text-white/70 sm:grid-cols-3">
                {[
                  ["Live intelligence", "Infrastructure and issue data in one view"],
                  ["Transparent flow", "Actionable reporting with public accountability"],
                  ["Smart oversight", "Designed for government-tech clarity"],
                ].map(([title, description]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-2 leading-6 text-white/68">{description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="px-1 pb-4 text-white/70">
                  <p className="small-caps text-white/55">Page previews</p>
                  <p className="mt-1 text-sm text-white/68">Browse key screens from the platform</p>
                </div>

                <div className="relative min-h-[520px] overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#0f2348] p-4 sm:p-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={previewSlides[slideIndex].key}
                      initial={{ opacity: 0, x: 28, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -28, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="flex h-full items-stretch"
                    >
                      <div className="flex w-full flex-col justify-between gap-4">
                        <div className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.65rem] uppercase tracking-[0.22em] text-white/70">
                          <span>{previewSlides[slideIndex].label}</span>
                          <span>{String(slideIndex + 1).padStart(2, "0")}/{String(previewSlides.length).padStart(2, "0")}</span>
                        </div>

                        <div className="flex-1 py-2">
                          {previewSlides[slideIndex].render()}
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1 text-white/55">
                          <div className="flex gap-2">
                            {previewSlides.map((slide, index) => (
                              <button
                                key={slide.key}
                                type="button"
                                onClick={() => setSlideIndex(index)}
                                className={`h-2.5 rounded-full transition-all ${
                                  index === slideIndex ? "w-8 bg-white" : "w-2.5 bg-white/30"
                                }`}
                                aria-label={`Show ${slide.label} preview`}
                              />
                            ))}
                          </div>
                          <span className="text-xs uppercase tracking-[0.18em] text-white/40">RoadWatch preview</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="about" className="relative bg-surface py-20 sm:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55 }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="small-caps text-ink/50">Core capabilities</div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                Empowering citizens and authorities with actionable intelligence.
              </h2>
              <p className="mt-5 text-base leading-8 text-ink/68 sm:text-lg">
                A minimal, modern system for understanding road conditions, resolving issues faster, and keeping public
                infrastructure visible and accountable.
              </p>
            </motion.div>

            <div id="capabilities" className="mt-12 grid gap-5 lg:mt-16 lg:grid-cols-3">
              {capabilities.map((feature, index) => {
                const interactive = feature.title !== "Infrastructure Transparency";

                return (
                  <motion.article
                    key={feature.title}
                    custom={index}
                    variants={capabilityMotion}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    onClick={
                      feature.title === "Real-time Road Tracking"
                        ? onMap
                        : feature.title === "Citizen Reporting"
                          ? onReport
                          : undefined
                    }
                    role={interactive ? "button" : undefined}
                    tabIndex={interactive ? 0 : undefined}
                    className={`group rounded-[1.25rem] border border-border bg-white p-6 transition duration-200 ${
                      interactive
                        ? "cursor-pointer shadow-[0_8px_22px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-[#b8c7de] hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                        : "shadow-[0_8px_22px_rgba(15,23,42,0.05)]"
                    }`}
                  >
                    <div className={`grid h-14 w-14 place-items-center rounded-2xl ${feature.tone}`}>
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
                        {feature.icon}
                      </svg>
                    </div>
                    <h3 className="mt-8 text-2xl font-semibold tracking-tight text-ink">{feature.title}</h3>
                    <p className="mt-4 max-w-sm text-base leading-8 text-ink/70">{feature.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="features" className="py-0">
          <div className="w-full bg-surface">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-3xl text-center"
              >
                <div className="small-caps text-ink/50">Features</div>
                <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  Product-focused capabilities built for civic infrastructure.
                </h2>
                <p className="mt-6 mx-auto max-w-2xl text-base leading-9 text-ink/68 sm:text-lg">
                  Each feature panel highlights how RoadWatch helps citizens and authorities search, report, and track
                  issues with transparency and clarity.
                </p>
              </motion.div>
            </div>
            <div className="w-full border-t border-border" />
          </div>

          <div className="mt-12 space-y-12">
            {featureShowcase.map((feature, index) => {
              const isEven = index % 2 === 0;
              const isDark = index % 2 === 1;
              const handleAction = () => {
                if (feature.onAction === "map") {
                  onMap();
                }
                if (feature.onAction === "complaint") {
                  onReport();
                }
                if (feature.onAction === "dashboard") {
                  onNavigate?.("/dashboard");
                }
              };

              return (
                <section
                  key={feature.id}
                  className={`min-h-[92vh] py-14 ${
                    isDark
                      ? "bg-navy-deep text-white shadow-[0_32px_80px_rgba(11,26,55,0.18)]"
                      : "bg-surface text-ink"
                  }`}
                >
                  <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.55fr_0.45fr] lg:gap-16 lg:px-8">
                    <div className={`space-y-6 ${isEven ? "order-1" : "order-2"}`}>
                      <p className={`small-caps ${isDark ? "text-white/60" : "text-ink/50"}`}>
                        Feature {index + 1}
                      </p>
                      <h3 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${isDark ? "text-white" : "text-ink"}`}>
                        {feature.title}
                      </h3>
                      <p className={`text-base leading-8 sm:text-lg ${isDark ? "text-white/72" : "text-ink/68"}`}>
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleAction}
                          className={`rounded-xl px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition ${
                            isDark
                              ? "bg-white text-navy hover:bg-white/90"
                              : "bg-navy text-white hover:bg-navy-deep"
                          }`}
                        >
                          {feature.cta}
                        </button>
                        <button
                          type="button"
                          className={`rounded-xl px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                            isDark
                              ? "border border-white/30 text-white/75 hover:border-white/50"
                              : "border border-border text-ink/70"
                          }`}
                        >
                          Learn more
                        </button>
                      </div>
                    </div>

                    <div className={`${isEven ? "order-2" : "order-1"}`}>
                      {feature.visual}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-border bg-navy-deep text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 text-sm sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <p className="text-white/72">&copy; 2026 RoadWatch. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/76">
            <a href="#top" className="transition hover:text-white">
              Privacy Policy
            </a>
            <a href="#top" className="transition hover:text-white">
              Terms of Service
            </a>
            <button type="button" onClick={onLogin} className="transition hover:text-white">
              Department Login
            </button>
            <a href="#contact" className="transition hover:text-white">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;