import type { Elysia } from "elysia";
import { logoutController } from "@modules/auth/controllers/logout";
import { logoutDetail } from "@modules/auth/routes/docs";

export const registerAuthLogoutRoute = (app: Elysia) => {
  app.post("/logout", logoutController as any, {
    detail: logoutDetail as any
  });

  return app;
};

