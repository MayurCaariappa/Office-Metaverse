import { createServer, type Server as HttpServer } from "node:http";
import type { Application } from "express";
import WebSocket, { WebSocketServer } from "ws";
import { PlayerRegistry } from "./playerRegistry";
import { authenticateSocket } from "./auth";
import type {
  RealtimeClientMessage,
  RealtimeServerMessage,
} from "../types/contracts";
import { moveSchema } from "../validation/schemas";

const INITIAL_POSITION = { x: 400, y: 120 };

interface TrackedSocket extends WebSocket {
  playerId?: string;
  roomId?: string;
}

function send(ws: WebSocket, message: RealtimeServerMessage) {
  ws.send(JSON.stringify(message));
}

export function startServers({
  app,
  apiPort,
  jwtSecret,
  wsPort,
}: {
  app: Application;
  apiPort: number;
  jwtSecret: string;
  wsPort: number;
}) {
  const httpServer: HttpServer = createServer(app);
  const socketServer = new WebSocketServer({ port: wsPort });
  const registry = new PlayerRegistry();

  socketServer.on("connection", (rawSocket, request) => {
    const ws = rawSocket as TrackedSocket;

    try {
      const session = authenticateSocket(ws, request, jwtSecret);
      ws.playerId = session.auth.username;
      ws.roomId = session.mapId;

      registry.add(session.mapId, {
        id: session.auth.username,
        position: { ...INITIAL_POSITION },
        ws,
      });

      send(ws, {
        type: "session.init",
        payload: {
          self: {
            id: session.auth.username,
            position: { ...INITIAL_POSITION },
          },
          mapId: session.mapId,
          players: registry.list(session.mapId),
        },
      });

      broadcastRoom(session.mapId);

      ws.on("message", (rawData) => {
        try {
          const parsedData = JSON.parse(rawData.toString()) as RealtimeClientMessage;
          const validated = moveSchema.parse(parsedData);
          registry.update(session.mapId, session.auth.username, validated.payload);
          broadcastRoom(session.mapId);
        } catch {
          ws.send(
            JSON.stringify({
              type: "presence.sync",
              payload: {
                players: registry.list(session.mapId),
              },
            } satisfies RealtimeServerMessage)
          );
        }
      });

      ws.on("close", () => {
        registry.remove(session.mapId, session.auth.username);
        broadcastRoom(session.mapId);
      });
    } catch {
      ws.close();
    }
  });

  function broadcastRoom(roomId: string) {
    const message: RealtimeServerMessage = {
      type: "presence.sync",
      payload: {
        players: registry.list(roomId),
      },
    };

    socketServer.clients.forEach((client) => {
      const trackedClient = client as TrackedSocket;

      if (
        trackedClient.readyState === WebSocket.OPEN &&
        trackedClient.roomId === roomId
      ) {
        send(trackedClient, message);
      }
    });
  }

  return new Promise<{ httpServer: HttpServer; socketServer: WebSocketServer }>(
    (resolve) => {
      httpServer.listen(apiPort, () => {
        resolve({ httpServer, socketServer });
      });
    }
  );
}
