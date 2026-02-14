import type { Elysia } from "elysia";
import { refreshController } from "@modules/auth/controllers/refresh";
import { validateBody } from "@middlewares/validate";
import { createRateLimiter } from "@middlewares/rateLimit";
import { refreshSchema } from "@modules/auth/validators";
import { refreshDetail } from "@modules/auth/routes/docs";

export const registerAuthRefreshRoute = (app: Elysia) => {
  app.post("/refresh", refreshController as any, {
    beforeHandle: [createRateLimiter("auth-refresh", 20, 60_000), validateBody(refreshSchema)],
    detail: refreshDetail as any
  });

  return app;
};


