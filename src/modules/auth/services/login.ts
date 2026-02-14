import { randomUUID } from "node:crypto";
import { appConfig } from "@config/app";
import { unauthorized } from "@common/errorFactory";
import { comparePassword, hashValue } from "@utils/hash";
import { signAccessToken, signRefreshToken } from "@utils/token";
import {
  createRefreshTokenRepository,
  findUserByEmailRepository
} from "@modules/auth/repositories";
import type { AuthResponseData, LoginBody } from "@modules/auth/types";

export const loginService = async (body: LoginBody): Promise<AuthResponseData> => {
  const user = await findUserByEmailRepository(body.email);
  if (!user) {
    throw unauthorized("Invalid email or password");
  }

  const isValidPassword = await comparePassword(body.password, user.password);
  if (!isValidPassword) {
    throw unauthorized("Invalid email or password");
  }

  const roleName = (user as any).role?.name ?? "user";
  const sessionId = randomUUID();
  const tokenId = randomUUID();

  const token = await signAccessToken({
    userId: user.id,
    role: roleName,
    sessionId,
    tokenId
  });

  const refreshToken = await signRefreshToken({
    userId: user.id,
    role: roleName,
    sessionId,
    tokenId
  });

  const now = Date.now();
  const sessionStartedAt = new Date(now);
  const refreshMaxAt = now + appConfig.auth.refreshTokenTtlSeconds * 1000;
  const sessionMaxAt = now + appConfig.auth.sessionMaxAgeSeconds * 1000;
  const expiresAt = new Date(Math.min(refreshMaxAt, sessionMaxAt));

  await createRefreshTokenRepository({
    userId: user.id,
    sessionId,
    tokenId,
    tokenHash: await hashValue(refreshToken),
    expiresAt,
    sessionStartedAt
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName
    },
    token,
    refreshToken,
    expiredToken: appConfig.auth.accessTokenTtlSeconds
  };
};

