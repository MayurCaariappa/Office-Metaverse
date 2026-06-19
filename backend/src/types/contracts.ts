export type UserRole = "user" | "admin";

export interface AuthTokenPayload {
  username: string;
  role: UserRole;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, string | number | boolean>;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface UserRecord {
  username: string;
  passwordHash: string;
  role: UserRole;
}

export interface PublicUser {
  username: string;
  role: UserRole;
}

export interface MapRecord {
  mapId: number;
  mapName: string;
  imagePath: string;
}

export interface AvatarRecord {
  avatarId: number;
  avatarName: string;
  imagePath: string;
}

export interface PlayerState {
  id: string;
  position: {
    x: number;
    y: number;
  };
}

export interface RealtimeSessionInit {
  self: PlayerState;
  mapId: string;
  players: PlayerState[];
}

export interface RealtimeClientMoveMessage {
  type: "player.move";
  payload: {
    x: number;
    y: number;
  };
}

export interface RealtimeServerInitMessage {
  type: "session.init";
  payload: RealtimeSessionInit;
}

export interface RealtimeServerPresenceMessage {
  type: "presence.sync";
  payload: {
    players: PlayerState[];
  };
}

export type RealtimeClientMessage = RealtimeClientMoveMessage;
export type RealtimeServerMessage =
  | RealtimeServerInitMessage
  | RealtimeServerPresenceMessage;
