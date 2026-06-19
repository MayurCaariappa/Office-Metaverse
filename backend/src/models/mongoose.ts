import mongoose, { Model, Schema } from "mongoose";
import type {
  AvatarRecord,
  MapRecord,
  UserRecord,
} from "../types/contracts";

const userSchema = new Schema<UserRecord>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const mapSchema = new Schema<MapRecord>(
  {
    mapId: { type: Number, required: true, unique: true },
    mapName: { type: String, required: true, trim: true },
    imagePath: { type: String, required: true },
  },
  { timestamps: true }
);

const avatarSchema = new Schema<AvatarRecord>(
  {
    avatarId: { type: Number, required: true, unique: true },
    avatarName: { type: String, required: true, trim: true },
    imagePath: { type: String, required: true },
  },
  { timestamps: true }
);

export const UserModel: Model<UserRecord> =
  mongoose.models.User || mongoose.model<UserRecord>("User", userSchema);

export const MapModel: Model<MapRecord> =
  mongoose.models.Map || mongoose.model<MapRecord>("Map", mapSchema);

export const AvatarModel: Model<AvatarRecord> =
  mongoose.models.Avatar ||
  mongoose.model<AvatarRecord>("Avatar", avatarSchema);
