import express from "express";
import cors from "cors";
import path from "node:path";
import { ZodError } from "zod";
import type { AppEnv } from "../config/env";
import type {
  AvatarRepository,
  MapRepository,
  UserRepository,
} from "../repositories/interfaces";
import { createAuthRouter } from "../routes/auth.routes";
import { createAvatarRouter } from "../routes/avatar.routes";
import { createHealthRouter } from "../routes/health.routes";
import { createMapRouter } from "../routes/map.routes";
import { AppError, errorHandler } from "../utils/http";

export interface AppDependencies {
  env: AppEnv;
  repositories: {
    users: UserRepository;
    maps: MapRepository;
    avatars: AvatarRepository;
  };
}

export function createApp({ env, repositories }: AppDependencies) {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN,
      credentials: false,
    }),
  );
  app.use(express.json());
  app.use("/uploads", express.static(path.join(env.UPLOAD_DIR)));

  app.use("/api/v1/health", createHealthRouter());
  app.use("/api/v1/auth", createAuthRouter(repositories.users, env.JWT_SECRET));
  app.use(
    "/api/v1/maps",
    createMapRouter({
      assetBaseUrl: env.ASSET_BASE_URL,
      jwtSecret: env.JWT_SECRET,
      mapRepository: repositories.maps,
      uploadRoot: env.UPLOAD_DIR,
    }),
  );
  app.use(
    "/api/v1/avatars",
    createAvatarRouter({
      assetBaseUrl: env.ASSET_BASE_URL,
      avatarRepository: repositories.avatars,
      jwtSecret: env.JWT_SECRET,
      uploadRoot: env.UPLOAD_DIR,
    }),
  );

  app.use(
    (
      error: Error,
      _req: express.Request,
      _res: express.Response,
      next: express.NextFunction,
    ) => {
      if (error instanceof ZodError) {
        return next(
          new AppError(
            400,
            "VALIDATION_ERROR",
            "Request validation failed.",
            error.flatten(),
          ),
        );
      }

      return next(error);
    },
  );

  app.use(errorHandler);

  return app;
}
