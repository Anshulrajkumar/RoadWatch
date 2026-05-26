const Footer = () => {
  return (
    <footer className="border-t border-border bg-navy-deep text-white/70">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-2 px-6 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <span>Content owned by Ministry of Road Transport and Highways, Government of India</span>
        <div className="flex gap-4">
          <span>Terms of Use</span>
          <span>Privacy Policy</span>
          <span>Contact Us</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
