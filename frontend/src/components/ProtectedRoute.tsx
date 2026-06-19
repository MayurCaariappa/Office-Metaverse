import { Navigate, Outlet, useLocation } from "react-router-dom";

export function ProtectedRoute({
  isAuthenticated,
  ready,
}: {
  isAuthenticated: boolean;
  ready: boolean;
}) {
  const location = useLocation();

  if (!ready) {
    return <div className="screen-center">Restoring session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
