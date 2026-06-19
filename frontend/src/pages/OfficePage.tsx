import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Broadcast, Cursor, UsersThree } from "phosphor-react";
import { Link, useParams } from "react-router-dom";
import { OfficeCanvas } from "../components/OfficeCanvas";
import { listMaps } from "../lib/api";
import { useRealtimeRoom } from "../hooks/useRealtimeRoom";
import type { AuthUser, MapItem } from "../types";

function formatConnectionState(status: string) {
  if (status === "connected") {
    return "Live";
  }

  if (status === "reconnecting") {
    return "Reconnecting";
  }

  return "Connecting";
}

export function OfficePage({
  currentUser,
  token,
}: {
  currentUser: AuthUser;
  token: string;
}) {
  const { mapId } = useParams();
  const numericMapId = Number(mapId);
  const [maps, setMaps] = useState<MapItem[]>([]);

  useEffect(() => {
    listMaps().then(setMaps).catch(() => setMaps([]));
  }, []);

  const selectedMap = useMemo(
    () => maps.find((map) => map.mapId === numericMapId) ?? null,
    [maps, numericMapId]
  );

  const realtime = useRealtimeRoom({
    token,
    mapId: Number.isNaN(numericMapId) ? 0 : numericMapId,
  });

  if (!selectedMap) {
    return (
      <main className="page-shell">
        <div className="glass-card info-card">
          Loading office environment...
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell office-shell">
      <section className="page-header">
        <div>
          <Link className="back-link" to="/maps">
            <ArrowLeft size={18} />
            Back to maps
          </Link>
          <h1>{selectedMap.mapName}</h1>
          <p className="lead">
            Drive your player with arrow keys or WASD. Every connected user in this
            room receives live position updates through the realtime service.
          </p>
        </div>

        <div className="status-chip">
          <Broadcast size={18} />
          {formatConnectionState(realtime.connectionState)}
        </div>
      </section>

      <section className="office-layout">
        <div className="glass-card canvas-panel">
          <OfficeCanvas
            map={selectedMap}
            players={realtime.players}
            self={realtime.self}
            onMove={realtime.moveSelf}
          />
        </div>

        <aside className="office-sidebar">
          <section className="glass-card sidebar-card">
            <div className="sidebar-card-header">
              <UsersThree size={22} weight="duotone" />
              <h2>Session snapshot</h2>
            </div>
            <p>
              Logged in as <strong>{currentUser.username}</strong> with the{" "}
              <strong>{currentUser.role}</strong> role.
            </p>
            <p>{realtime.players.length} connected avatar(s) currently visible in this room.</p>
          </section>

          <section className="glass-card sidebar-card">
            <div className="sidebar-card-header">
              <Cursor size={22} weight="duotone" />
              <h2>Controls</h2>
            </div>
            <ul className="plain-list">
              <li>Arrow keys or WASD move your player.</li>
              <li>Open the app in another tab to validate multiplayer sync.</li>
              <li>The surrounding shell is designed to make the realtime demo easier to understand.</li>
            </ul>
          </section>

          <section className="glass-card sidebar-card">
            <div className="sidebar-card-header">
              <Broadcast size={22} weight="duotone" />
              <h2>Live players</h2>
            </div>
            <ul className="player-list">
              {realtime.players.map((player) => (
                <li key={player.id}>
                  <span>{player.id}</span>
                  <small>
                    {player.position.x}, {player.position.y}
                  </small>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </main>
  );
}
