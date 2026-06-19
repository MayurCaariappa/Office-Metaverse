import type { NextFunction, Request, Response } from "express";
import type { AuthTokenPayload, UserRole } from "../types/contracts";
import { verifyAuthToken } from "../services/auth.service";
import { AppError } from "../utils/http";

export interface AuthenticatedRequest extends Request {
  auth?: AuthTokenPayload;
}

export function requireAuth(secret: string) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return next(
        new AppError(
          401,
          "AUTH_MISSING",
          "Authorization token is required for this endpoint.",
        ),
      );
    }

    const token = authorization.replace(/^Bearer\s+/i, "");

    try {
      req.auth = verifyAuthToken(token, secret);
      return next();
    } catch {
      return next(
        new AppError(
          401,
          "AUTH_INVALID",
          "The provided token is invalid or has expired.",
        ),
      );
    }
  };
}

export function requireRole(role: UserRole) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(
        new AppError(401, "AUTH_MISSING", "You must be signed in first."),
      );
    }

    if (req.auth.role !== role) {
      return next(
        new AppError(
          403,
          "FORBIDDEN",
          `${role} privileges are required for this endpoint.`,
        ),
      );
    }

    return next();
  };
}
