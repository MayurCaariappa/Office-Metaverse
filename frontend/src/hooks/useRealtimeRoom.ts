import { useEffect, useRef, useState } from "react";
import { env } from "../lib/env";
import type { PlayerState, RealtimeServerMessage } from "../types";

type ConnectionState = "connecting" | "connected" | "reconnecting" | "closed";

export function useRealtimeRoom({
  token,
  mapId,
}: {
  token: string;
  mapId: number;
}) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [selfId, setSelfId] = useState<string>("");
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");

  useEffect(() => {
    let isUnmounted = false;

    const connect = () => {
      setConnectionState((current) =>
        current === "connected" ? "connected" : "connecting"
      );

      const url = new URL(env.wsBaseUrl);
      url.searchParams.set("token", token);
      url.searchParams.set("mapId", String(mapId));

      const socket = new WebSocket(url.toString());
      socketRef.current = socket;

      socket.onopen = () => {
        if (!isUnmounted) {
          setConnectionState("connected");
        }
      };

      socket.onmessage = (event) => {
        const parsed = JSON.parse(event.data) as RealtimeServerMessage;

        if (parsed.type === "session.init") {
          setSelfId(parsed.payload.self.id);
          setPlayers(parsed.payload.players);
        }

        if (parsed.type === "presence.sync") {
          setPlayers(parsed.payload.players);
        }
      };

      socket.onclose = () => {
        if (isUnmounted) {
          return;
        }

        setConnectionState("reconnecting");
        reconnectTimeoutRef.current = window.setTimeout(connect, 1800);
      };
    };

    connect();

    return () => {
      isUnmounted = true;

      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }

      socketRef.current?.close();
    };
  }, [mapId, token]);

  const self = players.find((player) => player.id === selfId) ?? null;

  function moveSelf(position: { x: number; y: number }) {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        type: "player.move",
        payload: position,
      })
    );
  }

  return {
    connectionState,
    moveSelf,
    players,
    self,
    selfId,
  };
}
