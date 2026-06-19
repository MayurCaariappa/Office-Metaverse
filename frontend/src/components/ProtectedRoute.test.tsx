import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

function renderProtectedRoute({
  isAuthenticated,
  ready,
  initialPath,
}: {
  isAuthenticated: boolean;
  ready: boolean;
  initialPath: string;
}) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          element={<ProtectedRoute isAuthenticated={isAuthenticated} ready={ready} />}
        >
          <Route path="/maps" element={<div>Maps page</div>} />
        </Route>
        <Route path="/" element={<div>Auth page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("renders a loading state before session restoration completes", () => {
    renderProtectedRoute({
      isAuthenticated: false,
      ready: false,
      initialPath: "/maps",
    });

    expect(screen.getByText("Restoring session...")).toBeInTheDocument();
  });

  it("redirects unauthenticated users back to auth", () => {
    renderProtectedRoute({
      isAuthenticated: false,
      ready: true,
      initialPath: "/maps",
    });

    expect(screen.getByText("Auth page")).toBeInTheDocument();
  });
});
