import type { Elysia } from "elysia";
import { registerV1Routes } from "@routes/v1/index";

export const registerRoutes = (app: Elysia) => {
  registerV1Routes(app);
  return app;
};
