import { RefreshToken } from "@schemas/models";

export const revokeRefreshTokensBySessionIdRepository = async (sessionId: string) => {
  return RefreshToken.update(
    { revokedAt: new Date() },
    {
      where: { sessionId }
    }
  );
};
