import path from "node:path";
import { Router } from "express";
import type { MapRepository } from "../repositories/interfaces";
import { createImageUpload } from "../middleware/upload.middleware";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { mapSchema } from "../validation/schemas";
import { AppError, asyncHandler, ok } from "../utils/http";
import { buildAssetUrl, normalizeAssetPath } from "../utils/assets";

export function createMapRouter({
  assetBaseUrl,
  jwtSecret,
  mapRepository,
  uploadRoot,
}: {
  assetBaseUrl: string;
  jwtSecret: string;
  mapRepository: MapRepository;
  uploadRoot: string;
}) {
  const router = Router();
  const upload = createImageUpload(path.join(uploadRoot, "maps"));
  const requireAdmin = [requireAuth(jwtSecret), requireRole("admin")];

  router.get(
    "/",
    asyncHandler(async (_req, res) => {
      const maps = await mapRepository.list();
      return ok(res, {
        items: maps.map((map) => ({
          ...map,
          imageUrl: buildAssetUrl(assetBaseUrl, map.imagePath),
        })),
      });
    }),
  );

  router.post(
    "/",
    ...requireAdmin,
    upload.single("mapImage"),
    asyncHandler(async (req, res) => {
      const payload = mapSchema.parse(req.body);

      if (!req.file) {
        throw new AppError(
          400,
          "MAP_IMAGE_REQUIRED",
          "A map image is required.",
        );
      }

      const existing = await mapRepository.findByMapId(payload.mapId);

      if (existing) {
        throw new AppError(
          409,
          "MAP_EXISTS",
          `Map ${payload.mapId} already exists.`,
        );
      }

      const created = await mapRepository.create({
        ...payload,
        imagePath: normalizeAssetPath("uploads", "maps", req.file.filename),
      });

      return ok(
        res,
        {
          message: "Map created successfully.",
          map: {
            ...created,
            imageUrl: buildAssetUrl(assetBaseUrl, created.imagePath),
          },
        },
        201,
      );
    }),
  );

  router.delete(
    "/:mapId",
    ...requireAdmin,
    asyncHandler(async (req, res) => {
      const mapId = Number(req.params.mapId);
      const deleted = await mapRepository.deleteByMapId(mapId);

      if (!deleted) {
        throw new AppError(404, "MAP_NOT_FOUND", `Map ${mapId} was not found.`);
      }

      return ok(res, {
        message: `Map ${mapId} deleted successfully.`,
      });
    }),
  );

  return router;
}
