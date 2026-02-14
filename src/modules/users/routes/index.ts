import type { Elysia } from "elysia";
import { registerUsersGetRoute } from "@modules/users/routes/get";

export const registerUsersRoutes = (app: Elysia) => {
  registerUsersGetRoute(app);
  return app;
};

