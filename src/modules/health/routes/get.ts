import type { Elysia } from "elysia";
import { getHealthController } from "@modules/health/controllers/get";
import { healthGetDetail } from "@modules/health/routes/docs";

export const registerHealthGetRoute = (app: Elysia) => {
  app.get("/health", getHealthController as any, {
    detail: healthGetDetail as any
  });

  return app;
};

