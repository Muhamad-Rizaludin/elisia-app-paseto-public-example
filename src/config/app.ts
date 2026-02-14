import { parseDurationToSeconds } from "@utils/date";

const nodeEnv = (process.env.NODE_ENV ?? "development") as
  | "development"
  | "staging"
  | "production"
  | "test";

const port = Number(process.env.PORT ?? "3000");

export const appConfig = {
  nodeEnv,
  host: process.env.HOST ?? "0.0.0.0",
  port,
  swaggerEnabled: nodeEnv === "development" || nodeEnv === "staging",
  db: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? "5432"),
    username: process.env.DB_USERNAME ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    database:
      nodeEnv === "test"
        ? process.env.DB_NAME_TEST ?? "elisia_app_test"
        : process.env.DB_NAME ?? "elisia_app",
    dialect: "postgres" as const,
    logging: nodeEnv === "development" ? console.log : false
  },
  auth: {
    accessTokenTtl: process.env.ACCESS_TOKEN_TTL ?? "8h",
    refreshTokenTtl: process.env.REFRESH_TOKEN_TTL ?? "8h",
    sessionMaxAge: process.env.SESSION_MAX_AGE ?? "8h",
    accessTokenTtlSeconds: parseDurationToSeconds(process.env.ACCESS_TOKEN_TTL ?? "8h", 60 * 60 * 8),
    refreshTokenTtlSeconds: parseDurationToSeconds(process.env.REFRESH_TOKEN_TTL ?? "8h", 60 * 60 * 8),
    sessionMaxAgeSeconds: parseDurationToSeconds(process.env.SESSION_MAX_AGE ?? "8h", 60 * 60 * 8),
    accessTokenCookieName: process.env.ACCESS_TOKEN_COOKIE_NAME ?? "token",
    refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME ?? "refreshToken",
    expiredTokenCookieName: process.env.EXPIRED_TOKEN_COOKIE_NAME ?? "expiredToken",
    privateKeyPath: process.env.PRIVATE_KEY_PATH ?? "keys/private.key",
    publicKeyPath: process.env.PUBLIC_KEY_PATH ?? "keys/public.key"
  },
  cookie: {
    secure: (process.env.COOKIE_SECURE ?? "false") === "true",
    sameSite: (process.env.COOKIE_SAME_SITE ?? "lax") as "lax" | "strict" | "none"
  }
};
