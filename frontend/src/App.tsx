import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useSession } from "./hooks/useSession";
import { AuthPage } from "./pages/AuthPage";
import { MapPage } from "./pages/MapPage";
import { OfficePage } from "./pages/OfficePage";
import type { AuthUser } from "./types";

function App() {
  const session = useSession();

  function handleAuthenticated(token: string, user: AuthUser) {
    session.save({ token, user });
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          session.isAuthenticated && session.ready ? (
            <Navigate to="/maps" replace />
          ) : (
            <AuthPage onAuthenticated={handleAuthenticated} />
          )
        }
      />

      <Route
        element={
          <ProtectedRoute
            isAuthenticated={session.isAuthenticated}
            ready={session.ready}
          />
        }
      >
        <Route
          path="/maps"
          element={
            session.user ? (
              <MapPage currentUser={session.user} onSignOut={session.clear} />
            ) : null
          }
        />
        <Route
          path="/office/:mapId"
          element={
            session.user && session.token ? (
              <OfficePage currentUser={session.user} token={session.token} />
            ) : null
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
