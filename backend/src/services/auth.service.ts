import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type {
  AuthTokenPayload,
  PublicUser,
  UserRecord,
} from "../types/contracts";
import type { UserRepository } from "../repositories/interfaces";
import { AppError } from "../utils/http";

const SALT_ROUNDS = 10;

export async function registerUser(
  repository: UserRepository,
  {
    username,
    password,
    role,
  }: { username: string; password: string; role: "user" | "admin" }
): Promise<PublicUser> {
  const existing = await repository.findByUsername(username);

  if (existing) {
    throw new AppError(
      409,
      "USER_EXISTS",
      `A user named "${username}" already exists.`
    );
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  return repository.create({ username, passwordHash, role });
}

export async function loginUser(
  repository: UserRepository,
  credentials: { username: string; password: string }
): Promise<UserRecord> {
  const user = await repository.findByUsername(credentials.username);

  if (!user) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Username or password is incorrect."
    );
  }

  const isMatch = await bcrypt.compare(credentials.password, user.passwordHash);

  if (!isMatch) {
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "Username or password is incorrect."
    );
  }

  return user;
}

export function signAuthToken(
  payload: AuthTokenPayload,
  secret: string
): string {
  return jwt.sign(payload, secret, { expiresIn: "8h" });
}

export function verifyAuthToken(token: string, secret: string) {
  return jwt.verify(token, secret) as AuthTokenPayload;
}
