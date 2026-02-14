import type { Elysia } from "elysia";
import { registerAuthRegisterRoute } from "@modules/auth/routes/register";
import { registerAuthLoginRoute } from "@modules/auth/routes/login";
import { registerAuthRefreshRoute } from "@modules/auth/routes/refresh";
import { registerAuthLogoutRoute } from "@modules/auth/routes/logout";
import { registerAuthMeRoute } from "@modules/auth/routes/me";

export const registerAuthRoutes = (app: Elysia) => {
  app.group("/auth", (authApp) => {
    registerAuthRegisterRoute(authApp);
    registerAuthLoginRoute(authApp);
    registerAuthRefreshRoute(authApp);
    registerAuthLogoutRoute(authApp);
    registerAuthMeRoute(authApp);
    return authApp;
  });

  return app;
};

