import type { Elysia } from "elysia";
import { loginController } from "@modules/auth/controllers/login";
import { validateBody } from "@middlewares/validate";
import { createRateLimiter } from "@middlewares/rateLimit";
import { loginSchema } from "@modules/auth/validators";
import { loginDetail } from "@modules/auth/routes/docs";

export const registerAuthLoginRoute = (app: Elysia) => {
  app.post("/login", loginController as any, {
    beforeHandle: [createRateLimiter("auth-login", 10, 60_000), validateBody(loginSchema)],
    detail: loginDetail as any
  });

  return app;
};


