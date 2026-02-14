import { config as loadEnv } from "dotenv";

const nodeEnv = process.env.NODE_ENV ?? "development";
loadEnv({ path: `.env.${nodeEnv}` });

const start = async () => {
  const [{ appConfig }, { logger }, { initDatabase }, { createApp }] = await Promise.all([
    import("@config/app"),
    import("@config/logger"),
    import("@config/database"),
    import("@config/bootstrap")
  ]);

  try {
    await initDatabase();

    const app = createApp();
    app.listen({
      hostname: appConfig.host,
      port: appConfig.port
    });

    logger.info(`Server started on http://${appConfig.host}:${appConfig.port}`);
  } catch (error) {
    logger.error("Failed to start app", { error });
    process.exit(1);
  }
};

start();
