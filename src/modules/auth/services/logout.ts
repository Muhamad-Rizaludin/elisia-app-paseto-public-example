import { unauthorized } from "@common/errorFactory";
import { verifyRefreshToken } from "@utils/token";
import { revokeRefreshTokensBySessionIdRepository } from "@modules/auth/repositories";

export const logoutService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw unauthorized("Refresh token is required for logout");
  }

  const payload = await verifyRefreshToken(refreshToken);
  await revokeRefreshTokensBySessionIdRepository(payload.sessionId);
};
