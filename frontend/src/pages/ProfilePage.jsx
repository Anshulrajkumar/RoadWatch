import { useAuth } from "../contexts/AuthContext.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const ProfilePage = ({ activePage, onNavigate, onBrandClick }) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      onNavigate?.("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) return null;

  const createdAt = user.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "—";

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink" style={{ colorScheme: "light" }}>
      <Header activePage={activePage} onNavigate={onNavigate} onBrandClick={onBrandClick} />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto w-full max-w-3xl">
          <section className="overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
            <div className="bg-navy px-6 py-6 text-center text-white sm:px-8 sm:py-8">
              <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full border-4 border-accent bg-navy-deep text-3xl font-semibold text-white">
                {(user.email || "U")[0].toUpperCase()}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-[2.05rem]">My Profile</h1>
              <p className="mt-2 text-sm text-white/72">{user.email}</p>
            </div>

            <div className="space-y-6 px-6 py-8 sm:px-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-[#f9fafb] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-ink/50">Email</p>
                  <p className="mt-1 text-sm font-medium text-ink">{user.email}</p>
                </div>

                <div className="rounded-xl border border-border bg-[#f9fafb] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-ink/50">User ID</p>
                  <p className="mt-1 truncate text-sm font-mono text-ink/70">{user.id}</p>
                </div>

                <div className="rounded-xl border border-border bg-[#f9fafb] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-ink/50">Joined</p>
                  <p className="mt-1 text-sm font-medium text-ink">{createdAt}</p>
                </div>

                <div className="rounded-xl border border-border bg-[#f9fafb] px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-ink/50">Provider</p>
                  <p className="mt-1 text-sm font-medium text-ink capitalize">
                    {user.app_metadata?.provider || "email"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onNavigate?.("/dashboard")}
                  className="flex-1 rounded-lg bg-navy px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-navy-deep"
                >
                  View Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 rounded-lg border border-red-300 bg-white px-4 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-red-600 transition hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
