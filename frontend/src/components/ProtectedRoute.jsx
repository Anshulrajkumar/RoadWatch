import { useAuth } from "../contexts/AuthContext.jsx";

/**
 * Wraps a component so that unauthenticated users are redirected to /login.
 * While the auth state is loading we show a skeleton spinner to avoid flash.
 */
const ProtectedRoute = ({ children, onNavigate }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login
    if (onNavigate) {
      onNavigate("/login");
    } else {
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
    return null;
  }

  return children;
};

export default ProtectedRoute;
