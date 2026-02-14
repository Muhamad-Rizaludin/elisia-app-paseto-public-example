import { randomUUID } from "node:crypto";
import { appConfig } from "@config/app";
import { conflict, notFound } from "@common/errorFactory";
import { hashPassword, hashValue } from "@utils/hash";
import { signAccessToken, signRefreshToken } from "@utils/token";
import {
  createRefreshTokenRepository,
  createUserRepository,
  findRoleByNameRepository,
  findUserByEmailRepository
} from "@modules/auth/repositories";
import type { AuthResponseData, RegisterBody } from "@modules/auth/types";

export const registerService = async (body: RegisterBody): Promise<AuthResponseData> => {
  const existingUser = await findUserByEmailRepository(body.email);
  if (existingUser) {
    throw conflict("Email already registered");
  }

  const role = await findRoleByNameRepository("user");
  if (!role) {
    throw notFound("Role user not found, run seeder first");
  }

  const user = await createUserRepository({
    roleId: role.id,
    name: body.name,
    email: body.email,
    password: await hashPassword(body.password)
  });

  const sessionId = randomUUID();
  const tokenId = randomUUID();

  const token = await signAccessToken({
    userId: user.id,
    role: role.name,
    sessionId,
    tokenId
  });

  const refreshToken = await signRefreshToken({
    userId: user.id,
    role: role.name,
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
      role: role.name
    },
    token,
    refreshToken,
    expiredToken: appConfig.auth.accessTokenTtlSeconds
  };
};

