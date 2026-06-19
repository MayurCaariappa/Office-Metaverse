import {
  AvatarModel,
  MapModel,
  UserModel,
} from "../models/mongoose";
import type {
  AvatarRepository,
  MapRepository,
  UserRepository,
} from "./interfaces";

export const mongoUserRepository: UserRepository = {
  async findByUsername(username) {
    return UserModel.findOne({ username }).lean();
  },
  async create(user) {
    const created = await UserModel.create(user);
    return {
      username: created.username,
      role: created.role,
    };
  },
};

export const mongoMapRepository: MapRepository = {
  async list() {
    return MapModel.find().sort({ mapId: 1 }).lean();
  },
  async findByMapId(mapId) {
    return MapModel.findOne({ mapId }).lean();
  },
  async create(map) {
    const created = await MapModel.create(map);
    return created.toObject();
  },
  async deleteByMapId(mapId) {
    return MapModel.findOneAndDelete({ mapId }).lean();
  },
};

export const mongoAvatarRepository: AvatarRepository = {
  async list() {
    return AvatarModel.find().sort({ avatarId: 1 }).lean();
  },
  async findByAvatarId(avatarId) {
    return AvatarModel.findOne({ avatarId }).lean();
  },
  async create(avatar) {
    const created = await AvatarModel.create(avatar);
    return created.toObject();
  },
};
