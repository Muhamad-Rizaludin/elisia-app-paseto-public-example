import type { Elysia } from "elysia";
import { registerController } from "@modules/auth/controllers/register";
import { validateBody } from "@middlewares/validate";
import { registerSchema } from "@modules/auth/validators";
import { registerDetail } from "@modules/auth/routes/docs";

export const registerAuthRegisterRoute = (app: Elysia) => {
  app.post("/register", registerController as any, {
    beforeHandle: [validateBody(registerSchema)],
    detail: registerDetail as any
  });

  return app;
};


