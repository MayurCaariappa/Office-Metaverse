import { URL } from "node:url";
import type { IncomingMessage } from "node:http";
import type WebSocket from "ws";
import { verifyAuthToken } from "../services/auth.service";
import { AppError } from "../utils/http";

export function authenticateSocket(
  ws: WebSocket,
  request: IncomingMessage,
  jwtSecret: string,
) {
  const requestUrl = new URL(
    request.url ?? "/",
    `http://${request.headers.host}`,
  );
  const queryToken = requestUrl.searchParams.get("token");
  const authHeader = request.headers.authorization;
  const rawToken = authHeader?.replace(/^Bearer\s+/i, "") ?? queryToken;

  if (!rawToken) {
    ws.close(4001, "Missing auth token");
    throw new AppError(401, "AUTH_MISSING", "WebSocket token is missing.");
  }

  const auth = verifyAuthToken(rawToken, jwtSecret);
  const mapId = requestUrl.searchParams.get("mapId") ?? "default-office";

  return {
    auth,
    mapId,
  };
}
