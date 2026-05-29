import { useEffect, useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ReportIssue from "./pages/ReportIssue.jsx";
import ComplaintHistoryPage from "./pages/ComplaintHistoryPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChatbotWidget from "./components/chatbot/ChatbotWidget.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


const App = () => {
  const getLocation = () => ({
    pathname: window.location.pathname || "/",
    hash: window.location.hash || "",
  });

  const [location, setLocation] = useState(getLocation);

  useEffect(() => {
    const handlePopState = () => setLocation(getLocation());

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (target) => {
    const currentTarget = `${location.pathname}${location.hash}`;

    if (target === currentTarget) {
      return;
    }

    if (target.startsWith("#")) {
      window.history.pushState({}, "", `/${target}`);
    } else {
      window.history.pushState({}, "", target);
    }

    setLocation(getLocation());
  };

  const activePage = (() => {
    const { pathname, hash } = location;

    if (pathname === "/login") return "login";
    if (pathname === "/register") return "register";
    if (pathname === "/profile") return "profile";

    if (pathname === "/map" || pathname === "/dashboard") {
      return pathname === "/map" ? "search" : "dashboard";
    }

    if (pathname === "/report") {
      return "complaint";
    }

    if (pathname === "/complaints") {
      return "dashboard";
    }

    if (hash === "#features" || hash === "#capabilities") {
      return "features";
    }

    if (hash === "#about") {
      return "about";
    }

    if (hash === "#contact") {
      return "contact";
    }

    return "home";
  })();

  // --- Login page ---
  if (location.pathname === "/login") {
    return (
      <>
        <LoginPage
          activePage={activePage}
          onNavigate={navigate}
          onBrandClick={() => navigate("/")}
        />
        <ChatbotWidget currentPage={location.pathname} />
      </>
    );
  }

  // --- Register page ---
  if (location.pathname === "/register") {
    return (
      <>
        <RegisterPage
          activePage={activePage}
          onNavigate={navigate}
          onBrandClick={() => navigate("/")}
        />
        <ChatbotWidget currentPage={location.pathname} />
      </>
    );
  }

  // --- Profile page (protected) ---
  if (location.pathname === "/profile") {
    return (
      <ProtectedRoute onNavigate={navigate}>
        <ProfilePage
          activePage={activePage}
          onNavigate={navigate}
          onBrandClick={() => navigate("/")}
        />
        <ChatbotWidget currentPage={location.pathname} />
      </ProtectedRoute>
    );
  }

  // --- Dashboard pages (map search / road tracking) ---
  if (location.pathname === "/map") {
    return (
      <>
        <DashboardLayout activePage={activePage} onNavigate={navigate} onBrandClick={() => navigate("/")}>
          <Dashboard onNavigate={navigate} />
        </DashboardLayout>
        <ChatbotWidget currentPage={location.pathname} />
      </>
    );
  }

  // --- Report Issue page ---
  if (location.pathname === "/report") {
    return (
      <>
        <DashboardLayout activePage={activePage} onNavigate={navigate} onBrandClick={() => navigate("/")}>
          <ReportIssue />
        </DashboardLayout>
        <ChatbotWidget currentPage={location.pathname} />
      </>
    );
  }

  // --- Complaint History / Tracking page (protected) ---
  if (location.pathname === "/complaints" || location.pathname === "/dashboard") {
    return (
      <ProtectedRoute onNavigate={navigate}>
        <DashboardLayout activePage={activePage} onNavigate={navigate} onBrandClick={() => navigate("/")}>
          <ComplaintHistoryPage />
        </DashboardLayout>
        <ChatbotWidget currentPage={location.pathname} />
      </ProtectedRoute>
    );
  }

  // --- Landing Page (default route) ---
  return (
    <>
      <LandingPage
        activePage={activePage}
        locationHash={location.hash}

        onMap={() => navigate("/map")}
        onReport={() => navigate("/report")}
        onNavigate={navigate}
        onBrandClick={() => {
          if (location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }

          navigate("/");
        }}
      />
      <ChatbotWidget currentPage={location.pathname} />
    </>
  );
};

export default App;
