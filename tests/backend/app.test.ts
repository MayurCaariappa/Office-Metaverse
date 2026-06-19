import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import bcrypt from "bcryptjs";
const require = createRequire(import.meta.url);
const { registerUser, loginUser, signAuthToken } = require("../../backend/src/services/authService");
const { requireAuth, requireRole } = require("../../backend/src/middleware/auth");
const { buildAssetUrl } = require("../../backend/src/utils/assets");
const { AppError } = require("../../backend/src/utils/http");


function createInMemoryRepositories() {
  const users = new Map();
  const maps = new Map([
    [
      1,
      {
        mapId: 1,
        mapName: "Main Atrium",
        imagePath: "uploads/maps/main-atrium.png",
      },
    ],
  ]);

  return {
    users: {
      async findByUsername(username: string) {
        return users.get(username) ?? null;
      },
      async create(user: {
        username: string;
        passwordHash: string;
        role: "user" | "admin";
      }) {
        users.set(user.username, user);
        return {
          username: user.username,
          role: user.role,
        };
      },
      dump() {
        return users;
      },
    },
    maps: {
      async list() {
        return Array.from(maps.values());
      },
      async findByMapId(mapId: number) {
        return maps.get(mapId) ?? null;
      },
      async create(map: {
        mapId: number;
        mapName: string;
        imagePath: string;
      }) {
        maps.set(map.mapId, map);
        return map;
      },
      async deleteByMapId(mapId: number) {
        const next = maps.get(mapId) ?? null;
        maps.delete(mapId);
        return next;
      },
    },
    avatars: {
      async list() {
        return [];
      },
      async findByAvatarId() {
        return null;
      },
      async create(avatar: {
        avatarId: number;
        avatarName: string;
        imagePath: string;
      }) {
        return avatar;
      },
    },
  };
}

function createTestApp() {
  return { repositories: createInMemoryRepositories() };
}

test("registerUser hashes passwords and loginUser validates credentials", async () => {
  const { repositories } = createTestApp();

  const createdUser = await registerUser(repositories.users, {
    username: "mayur",
    password: "recruiter123",
    role: "user",
  });

  assert.equal(createdUser.username, "mayur");
  assert.equal(createdUser.role, "user");

  const storedUser = repositories.users.dump().get("mayur");
  assert.notEqual(storedUser.passwordHash, "recruiter123");
  assert.equal(await bcrypt.compare("recruiter123", storedUser.passwordHash), true);

  const loggedInUser = await loginUser(repositories.users, {
    username: "mayur",
    password: "recruiter123",
  });

  assert.equal(loggedInUser.username, "mayur");
  assert.equal(loggedInUser.role, "user");
});

test("auth middleware rejects missing auth and non-admin access", async () => {
  const jwtSecret = "super-secret-test-key";
  const nextErrors: unknown[] = [];
  const authMiddleware = requireAuth(jwtSecret);
  const adminMiddleware = requireRole("admin");
  const res = {} as never;

  authMiddleware({ headers: {} } as never, res, (error?: unknown) => {
    if (error) {
      nextErrors.push(error);
    }
  });

  assert.equal(nextErrors.length, 1);
  assert.ok(nextErrors[0] instanceof AppError);
  assert.equal((nextErrors[0] as typeof AppError.prototype).statusCode, 401);

  const token = signAuthToken(
    {
      username: "player-one",
      role: "user",
    },
    jwtSecret
  );

  const request = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  } as never;

  authMiddleware(request, res, (error?: unknown) => {
    if (error) {
      throw error;
    }
  });

  adminMiddleware(request, res, (error?: unknown) => {
    if (error) {
      nextErrors.push(error);
    }
  });

  assert.equal(nextErrors.length, 2);
  assert.equal((nextErrors[1] as typeof AppError.prototype).statusCode, 403);
});

test("buildAssetUrl normalizes persisted upload paths for the frontend", () => {
  const url = buildAssetUrl(
    "http://localhost:3000/uploads",
    "uploads/maps/main-atrium.png"
  );

  assert.equal(url, "http://localhost:3000/uploads/maps/main-atrium.png");
});

test("loginUser rejects incorrect passwords", async () => {
  const { repositories } = createTestApp();

  await registerUser(repositories.users, {
    username: "player-one",
    password: "recruiter123",
    role: "user",
  });

  await assert.rejects(
    () =>
      loginUser(repositories.users, {
        username: "player-one",
        password: "wrong-password",
      }),
    (error: unknown) =>
      error instanceof AppError && (error as typeof AppError.prototype).statusCode === 401
  );
});
