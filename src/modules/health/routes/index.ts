import type { Elysia } from "elysia";
import { registerHealthGetRoute } from "@modules/health/routes/get";

export const registerHealthRoutes = (app: Elysia) => {
  registerHealthGetRoute(app);
  return app;
};

