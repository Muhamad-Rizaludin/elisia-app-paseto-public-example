import { randomUUID } from "node:crypto";
import { appConfig } from "@config/app";
import { unauthorized } from "@common/errorFactory";
import { compareValue, hashValue } from "@utils/hash";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@utils/token";
import {
  createRefreshTokenRepository,
  findRefreshTokenByTokenIdRepository,
  findUserByIdRepository,
  revokeRefreshTokenByTokenIdRepository
} from "@modules/auth/repositories";
import type { AuthResponseData } from "@modules/auth/types";

export const refreshService = async (token: string): Promise<AuthResponseData> => {
  const payload = await verifyRefreshToken(token);
  const storedToken = await findRefreshTokenByTokenIdRepository(payload.tokenId);

  if (!storedToken || storedToken.revokedAt) {
    throw unauthorized("Refresh token is no longer valid");
  }

  if (storedToken.expiresAt.getTime() <= Date.now()) {
    throw unauthorized("Refresh token has expired");
  }

  const sameToken = await compareValue(token, storedToken.tokenHash);
  if (!sameToken) {
    throw unauthorized("Refresh token mismatch");
  }

  const sessionMaxAt = storedToken.sessionStartedAt.getTime() + appConfig.auth.sessionMaxAgeSeconds * 1000;
  if (Date.now() >= sessionMaxAt) {
    throw unauthorized("Session has expired, please login again");
  }

  await revokeRefreshTokenByTokenIdRepository(payload.tokenId);

  const user = await findUserByIdRepository(payload.userId);
  if (!user) {
    throw unauthorized("User not found");
  }

  const roleName = (user as any).role?.name ?? payload.role;
  const newTokenId = randomUUID();

  const accessToken = await signAccessToken({
    userId: user.id,
    role: roleName,
    sessionId: payload.sessionId,
    tokenId: newTokenId
  });

  const refreshToken = await signRefreshToken({
    userId: user.id,
    role: roleName,
    sessionId: payload.sessionId,
    tokenId: newTokenId
  });

  const refreshMaxAt = Date.now() + appConfig.auth.refreshTokenTtlSeconds * 1000;
  const expiresAt = new Date(Math.min(refreshMaxAt, sessionMaxAt));

  await createRefreshTokenRepository({
    userId: user.id,
    sessionId: payload.sessionId,
    tokenId: newTokenId,
    tokenHash: await hashValue(refreshToken),
    expiresAt,
    sessionStartedAt: storedToken.sessionStartedAt
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roleName
    },
    token: accessToken,
    refreshToken,
    expiredToken: appConfig.auth.accessTokenTtlSeconds
  };
};

