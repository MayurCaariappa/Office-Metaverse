import { useEffect, useState } from "react";
import { ArrowRight, Compass, SignOut } from "phosphor-react";
import { Link } from "react-router-dom";
import { listMaps } from "../lib/api";
import type { AuthUser, MapItem } from "../types";

export function MapPage({
  currentUser,
  onSignOut,
}: {
  currentUser: AuthUser;
  onSignOut: () => void;
}) {
  const [maps, setMaps] = useState<MapItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isMounted = true;

    listMaps()
      .then((items) => {
        if (!isMounted) {
          return;
        }

        setMaps(items);
        setStatus("ready");
      })
      .catch(() => {
        if (isMounted) {
          setStatus("error");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page-shell">
      <section className="page-header">
        <div>
          <div className="eyebrow">Signed in as {currentUser.username}</div>
          <h1>Choose an office map</h1>
          <p className="lead">
            Browse the available office environments, pick a scene, and jump
            straight into the live multiplayer workspace.
          </p>
        </div>

        <button className="secondary-button" type="button" onClick={onSignOut}>
          <SignOut size={18} />
          Sign out
        </button>
      </section>

      {status === "loading" ? <div className="glass-card info-card">Loading maps...</div> : null}
      {status === "error" ? (
        <div className="glass-card info-card">
          We couldn&apos;t load maps from the API. Verify the backend is running and seeded
          with at least one map record.
        </div>
      ) : null}

      {status === "ready" ? (
        <section className="map-grid">
          {maps.length ? (
            maps.map((map) => (
              <article className="glass-card map-card" key={map.mapId}>
                <img src={map.imageUrl} alt={map.mapName} />
                <div className="map-card-body">
                  <div className="map-card-title-row">
                    <div>
                      <div className="pill subtle">Map #{map.mapId}</div>
                      <h2>{map.mapName}</h2>
                    </div>
                    <Compass size={28} weight="duotone" />
                  </div>
                  <p>
                    Enter this scene to explore multiplayer movement in a cleaner,
                    more productized workspace shell.
                  </p>
                  <Link className="primary-button inline-button" to={`/office/${map.mapId}`}>
                    Open workspace
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="glass-card info-card">
              No maps are available yet. Add one through the admin API to complete the demo.
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
