import { useState } from "react";

const navItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "#about" },
  { id: "features", label: "Features", href: "#features" },
  { id: "search", label: "Search", href: "/map" },
  { id: "complaint", label: "Complain section", href: "/complaint" },
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "contact", label: "Contact", href: "#contact" },
];

const Header = ({ activePage, onNavigate, onBrandClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (item) => {
    if (item.disabled) {
      return;
    }

    if (item.href.startsWith("#")) {
      onNavigate?.(item.href);
      setMenuOpen(false);
      return;
    }

    onNavigate?.(item.href);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[1000] border-b border-border bg-navy text-white shadow-[0_6px_18px_rgba(4,10,20,0.14)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button type="button" onClick={onBrandClick} className="flex items-center gap-3 text-left text-white">
          <div className="h-11 w-11 rounded-2xl bg-white/10" />
          <div>
            <p className="small-caps text-white/70">RoadWatch Platform</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.7rem]">RoadWatch</h1>
          </div>
        </button>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item)}
                disabled={item.disabled}
                className={`relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-white transition duration-200 ${
                  isActive ? "bg-white/10" : "hover:bg-white/6 hover:text-white hover:underline decoration-white/30 underline-offset-8"
                } ${item.disabled ? "cursor-default opacity-70 hover:no-underline hover:bg-white/10" : ""}`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-white transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/12 bg-white/8 text-white transition hover:bg-white/12 lg:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="flex w-4 flex-col gap-1.5">
            <span className={`h-0.5 rounded-full bg-current transition ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 rounded-full bg-current transition ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`h-0.5 rounded-full bg-current transition ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <div className={`overflow-hidden border-t border-white/10 bg-navy lg:hidden ${menuOpen ? "block" : "hidden"}`}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-3 sm:px-6">
          {navItems.map((item) => {
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item)}
                disabled={item.disabled}
                className={`relative flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm font-medium text-white transition ${
                  isActive ? "bg-white/10" : "hover:bg-white/6 hover:text-white"
                } ${item.disabled ? "cursor-default opacity-70 hover:bg-white/10" : ""}`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-white transition-opacity duration-200 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
      </header>

      {/* spacer to offset fixed header height so page content is not hidden */}
      <div aria-hidden className="h-20" />
    </>
  );
};

export default Header;
