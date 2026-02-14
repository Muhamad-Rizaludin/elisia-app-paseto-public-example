import { RefreshToken } from "@schemas/models";

export const createRefreshTokenRepository = async (payload: {
  userId: string;
  sessionId: string;
  tokenId: string;
  tokenHash: string;
  expiresAt: Date;
  sessionStartedAt: Date;
}) => {
  return RefreshToken.create(payload);
};
