import type { Elysia } from "elysia";
import { registerAuthRoutes } from "@modules/auth/routes";
import { registerUsersRoutes } from "@modules/users/routes";
import { registerHealthRoutes } from "@modules/health/routes";

export const registerV1Routes = (app: Elysia) => {
  app.group("/api/v1", (v1App) => {
    registerAuthRoutes(v1App);
    registerUsersRoutes(v1App);
    registerHealthRoutes(v1App);
    return v1App;
  });

  return app;
};
