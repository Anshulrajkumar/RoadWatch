const Header = () => {
  return (
    <header className="border-b border-border bg-navy text-white">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-white/10" />
          <div>
            <p className="small-caps text-white/70">Government of India</p>
            <h1 className="font-serif text-2xl tracking-tight">RoadWatch</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
