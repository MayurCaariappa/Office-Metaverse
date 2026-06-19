import { z } from "zod";

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or fewer"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be 72 characters or fewer"),
  role: z.enum(["user", "admin"]).optional().default("user"),
});

export const signinSchema = z.object({
  username: z.string().trim().min(3),
  password: z.string().min(8),
});

export const mapSchema = z.object({
  mapId: z.coerce.number().int().nonnegative(),
  mapName: z.string().trim().min(2).max(60),
});

export const avatarSchema = z.object({
  avatarId: z.coerce.number().int().nonnegative(),
  avatarName: z.string().trim().min(2).max(60),
});

export const moveSchema = z.object({
  type: z.literal("player.move"),
  payload: z.object({
    x: z.number().min(0).max(2000),
    y: z.number().min(0).max(2000),
  }),
});
