import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { useSwaggerPlugin } from "@plugins/swagger";
import { registerV1Routes } from "@routes/v1/index";
import { applyErrorHandler } from "@middlewares/errorHandler";

export const createApp = () => {
  const app = new Elysia();
  app.use(cookie());

  useSwaggerPlugin(app);
  registerV1Routes(app);
  applyErrorHandler(app);

  return app;
};
