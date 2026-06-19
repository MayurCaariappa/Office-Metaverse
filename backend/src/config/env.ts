import path from "node:path";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  API_PORT: z.coerce.number().int().positive().default(3000),
  WS_PORT: z.coerce.number().int().positive().default(8080),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  JWT_SECRET: z.string().min(12, "JWT_SECRET must be at least 12 characters"),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:5173"),
  API_BASE_URL: z.string().url().default("http://localhost:3000"),
  WS_BASE_URL: z.string().url().default("ws://localhost:8080"),
  ASSET_BASE_URL: z.string().url().default("http://localhost:3000"),
  UPLOAD_DIR: z
    .string()
    .default(path.resolve(process.cwd(), "backend/uploads")),
});

export type AppEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(source);
}
