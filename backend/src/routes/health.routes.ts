import { Router } from "express";
import { ok } from "../utils/http";

export function createHealthRouter() {
  const router = Router();

  router.get("/", (_req, res) =>
    ok(res, {
      status: "ok",
      service: "office-metaverse-api",
    })
  );

  return router;
}
