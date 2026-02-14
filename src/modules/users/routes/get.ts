import type { Elysia } from "elysia";
import { requireAuth } from "@middlewares/requireAuth";
import { requireRole } from "@middlewares/requireRole";
import { getUsersController } from "@modules/users/controllers/get";
import { usersGetDetail } from "@modules/users/routes/docs";

export const registerUsersGetRoute = (app: Elysia) => {
  app.get("/users", getUsersController as any, {
    beforeHandle: [requireAuth, requireRole(["admin"])],
    detail: usersGetDetail as any
  });

  return app;
};

