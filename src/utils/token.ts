import { createPrivateKey, createPublicKey } from "node:crypto";
import { readFileSync } from "node:fs";
import { V4 } from "paseto";
import { appConfig } from "@config/app";
import { unauthorized } from "@common/errorFactory";

type TokenPayloadBase = {
  userId: string;
  role: string;
  sessionId: string;
  tokenId: string;
  exp: number;
};

export type AccessTokenPayload = TokenPayloadBase;
export type RefreshTokenPayload = TokenPayloadBase;

let cachedPrivateKey: ReturnType<typeof createPrivateKey> | null = null;
let cachedPublicKey: ReturnType<typeof createPublicKey> | null = null;

const getPrivateKey = () => {
  if (cachedPrivateKey) return cachedPrivateKey;
  const key = readFileSync(appConfig.auth.privateKeyPath, "utf8");
  cachedPrivateKey = createPrivateKey(key);
  return cachedPrivateKey;
};

const getPublicKey = () => {
  if (cachedPublicKey) return cachedPublicKey;
  const key = readFileSync(appConfig.auth.publicKeyPath, "utf8");
  cachedPublicKey = createPublicKey(key);
  return cachedPublicKey;
};

const unixNow = () => Math.floor(Date.now() / 1000);

const assertExpiration = (exp: number) => {
  if (exp <= unixNow()) {
    throw unauthorized("Token has expired");
  }
};

export const signAccessToken = async (payload: Omit<AccessTokenPayload, "exp">): Promise<string> => {
  const exp = unixNow() + appConfig.auth.accessTokenTtlSeconds;
  return V4.sign({ ...payload, exp }, getPrivateKey());
};

export const signRefreshToken = async (payload: Omit<RefreshTokenPayload, "exp">): Promise<string> => {
  const exp = unixNow() + appConfig.auth.refreshTokenTtlSeconds;
  return V4.sign({ ...payload, exp }, getPrivateKey());
};

export const verifyAccessToken = async (token: string): Promise<AccessTokenPayload> => {
  try {
    const payload = (await V4.verify(token, getPublicKey())) as AccessTokenPayload;
    assertExpiration(payload.exp);
    return payload;
  } catch {
    throw unauthorized("Invalid access token");
  }
};

export const verifyRefreshToken = async (token: string): Promise<RefreshTokenPayload> => {
  try {
    const payload = (await V4.verify(token, getPublicKey())) as RefreshTokenPayload;
    assertExpiration(payload.exp);
    return payload;
  } catch {
    throw unauthorized("Invalid refresh token");
  }
};
