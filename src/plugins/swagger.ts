import { swagger } from "@elysiajs/swagger";
import { appConfig } from "@config/app";

export const useSwaggerPlugin = (app: any) => {
  if (!appConfig.swaggerEnabled) return;

  app.use(
    swagger({
      documentation: {
        info: {
          title: "Elysia PASETO API",
          version: "1.0.0",
          description: "Production-ready API with PASETO public tokens"
        }
      },
      path: "/docs"
    })
  );
};
