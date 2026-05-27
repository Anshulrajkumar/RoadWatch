const Header = () => {
  return (
    <header className="border-b border-border bg-navy text-white">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-full bg-white/10" />
            <div>
              <p className="small-caps text-white/70">Government of India</p>
              <h1 className="font-serif text-2xl tracking-tight">RoadWatch</h1>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.14em] text-white/70">
            <a className="transition hover:text-white" href="#/dashboard">
              Dashboard
            </a>
            <a className="transition hover:text-white" href="#/report">
              Report Issue
            </a>
            <a className="transition hover:text-white" href="#/complaints">
              Complaint Tracking
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
