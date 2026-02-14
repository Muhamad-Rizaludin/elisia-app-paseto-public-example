import type { Elysia } from "elysia";
import { meController } from "@modules/auth/controllers/me";
import { requireAuth } from "@middlewares/requireAuth";
import { meDetail } from "@modules/auth/routes/docs";

export const registerAuthMeRoute = (app: Elysia) => {
  app.get("/me", meController as any, {
    beforeHandle: [requireAuth],
    detail: meDetail as any
  });

  return app;
};

