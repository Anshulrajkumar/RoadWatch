import { useEffect, useState } from "react";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ComplaintPage from "./pages/ComplaintPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MyComplaintsPage from "./pages/MyComplaintsPage.jsx";

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

    if (pathname === "/login") {
      return null;
    }

    if (pathname === "/map") {
      return "search";
    }

    if (pathname === "/dashboard") {
      return "dashboard";
    }

    if (pathname === "/complaint") {
      return "complaint";
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

  if (location.pathname === "/login") {
    return <LoginPage activePage={activePage} onBack={() => navigate("/")} onNavigate={navigate} onBrandClick={() => navigate("/")} />;
  }

  if (location.pathname === "/dashboard") {
    return (
      <MyComplaintsPage
        activePage={activePage}
        onNavigate={navigate}
        onBrandClick={() => navigate("/")}
      />
    );
  }

  if (location.pathname === "/map") {
    return (
      <DashboardLayout activePage={activePage} onNavigate={navigate} onBrandClick={() => navigate("/")}>
        <Dashboard />
      </DashboardLayout>
    );
  }

  if (location.pathname === "/complaint") {
    return (
      <ComplaintPage
        activePage={activePage}
        onNavigate={navigate}
        onBrandClick={() => navigate("/")}
      />
    );
  }

  return (
    <LandingPage
      activePage={activePage}
      locationHash={location.hash}
      onLogin={() => navigate("/login")}
      onMap={() => navigate("/map")}
      onComplaint={() => navigate("/complaint")}
      onNavigate={navigate}
      onBrandClick={() => {
        if (location.pathname === "/") {
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }

        navigate("/");
      }}
    />
  );
};

export default App;
