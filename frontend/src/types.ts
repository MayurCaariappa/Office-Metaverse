export type UserRole = "user" | "admin";

export interface AuthUser {
  username: string;
  role: UserRole;
}

export interface AuthSuccessResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface MapItem {
  mapId: number;
  mapName: string;
  imagePath: string;
  imageUrl: string;
}

export interface AvatarItem {
  avatarId: number;
  avatarName: string;
  imagePath: string;
  imageUrl: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface PlayerState {
  id: string;
  position: {
    x: number;
    y: number;
  };
}

export interface RealtimeInitMessage {
  type: "session.init";
  payload: {
    self: PlayerState;
    mapId: string;
    players: PlayerState[];
  };
}

export interface RealtimePresenceMessage {
  type: "presence.sync";
  payload: {
    players: PlayerState[];
  };
}

export type RealtimeServerMessage = RealtimeInitMessage | RealtimePresenceMessage;
