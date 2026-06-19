import type {
  AvatarRecord,
  MapRecord,
  PublicUser,
  UserRecord,
} from "../types/contracts";

export interface UserRepository {
  findByUsername(username: string): Promise<UserRecord | null>;
  create(user: UserRecord): Promise<PublicUser>;
}

export interface MapRepository {
  list(): Promise<MapRecord[]>;
  findByMapId(mapId: number): Promise<MapRecord | null>;
  create(map: MapRecord): Promise<MapRecord>;
  deleteByMapId(mapId: number): Promise<MapRecord | null>;
}

export interface AvatarRepository {
  list(): Promise<AvatarRecord[]>;
  findByAvatarId(avatarId: number): Promise<AvatarRecord | null>;
  create(avatar: AvatarRecord): Promise<AvatarRecord>;
}
