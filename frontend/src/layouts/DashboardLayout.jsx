import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const DashboardLayout = ({ children }) => {
  return (
    <div className="rw-app relative min-h-screen bg-surface text-ink">
      <div className="rw-background pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
