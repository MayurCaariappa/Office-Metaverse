import path from "node:path";
import { Router } from "express";
import type { AvatarRepository } from "../repositories/interfaces";
import { createImageUpload } from "../middleware/upload.middleware";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { avatarSchema } from "../validation/schemas";
import { AppError, asyncHandler, ok } from "../utils/http";
import { buildAssetUrl, normalizeAssetPath } from "../utils/assets";

export function createAvatarRouter({
  assetBaseUrl,
  avatarRepository,
  jwtSecret,
  uploadRoot,
}: {
  assetBaseUrl: string;
  avatarRepository: AvatarRepository;
  jwtSecret: string;
  uploadRoot: string;
}) {
  const router = Router();
  const upload = createImageUpload(path.join(uploadRoot, "avatars"));
  const requireAdmin = [requireAuth(jwtSecret), requireRole("admin")];

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const avatars = await avatarRepository.list();
      return ok(res, {
        items: avatars.map((avatar) => ({
          ...avatar,
          imageUrl: buildAssetUrl(assetBaseUrl, avatar.imagePath),
        })),
      });
    }),
  );

  router.post(
    "/",
    ...requireAdmin,
    upload.single("avatarImage"),
    asyncHandler(async (req, res) => {
      const payload = avatarSchema.parse(req.body);

      if (!req.file) {
        throw new AppError(
          400,
          "AVATAR_IMAGE_REQUIRED",
          "An avatar image is required.",
        );
      }

      const existing = await avatarRepository.findByAvatarId(payload.avatarId);

      if (existing) {
        throw new AppError(
          409,
          "AVATAR_EXISTS",
          `Avatar ${payload.avatarId} already exists.`,
        );
      }

      const created = await avatarRepository.create({
        ...payload,
        imagePath: normalizeAssetPath("uploads", "avatars", req.file.filename),
      });

      return ok(
        res,
        {
          message: "Avatar created successfully.",
          avatar: {
            ...created,
            imageUrl: buildAssetUrl(assetBaseUrl, created.imagePath),
          },
        },
        201,
      );
    }),
  );

  return router;
}
