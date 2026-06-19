import { Router } from "express";
import type { UserRepository } from "../repositories/interfaces";
import {
  loginUser,
  registerUser,
  signAuthToken,
} from "../services/auth.service";
import { signinSchema, signupSchema } from "../validation/schemas";
import { asyncHandler, ok } from "../utils/http";

export function createAuthRouter(
  userRepository: UserRepository,
  jwtSecret: string,
) {
  const router = Router();

  router.post(
    "/signup",
    asyncHandler(async (req, res) => {
      const payload = signupSchema.parse(req.body);
      const user = await registerUser(userRepository, payload);
      const token = signAuthToken(user, jwtSecret);

      return ok(
        res,
        {
          message: "Account created successfully.",
          token,
          user,
        },
        201,
      );
    }),
  );

  router.post(
    "/signin",
    asyncHandler(async (req, res) => {
      const payload = signinSchema.parse(req.body);
      const user = await loginUser(userRepository, payload);
      const token = signAuthToken(
        { username: user.username, role: user.role },
        jwtSecret,
      );

      return ok(res, {
        message: "Signed in successfully.",
        token,
        user: {
          username: user.username,
          role: user.role,
        },
      });
    }),
  );

  return router;
}
