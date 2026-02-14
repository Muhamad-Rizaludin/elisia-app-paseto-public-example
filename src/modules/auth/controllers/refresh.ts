import { appConfig } from "@config/app";
import { logger } from "@config/logger";
import { unauthorized } from "@common/errorFactory";
import { successResponse } from "@common/baseResponse";
import { buildAuthCookies } from "@utils/cookies";
import { refreshService } from "@modules/auth/services/refresh";

export const refreshController = async (context: any) => {
  const bodyRefreshToken = context.body?.refreshToken;
  const cookieRefreshToken = context.cookie?.[appConfig.auth.refreshTokenCookieName]?.value;
  const refreshToken = bodyRefreshToken || cookieRefreshToken;

  if (!refreshToken) {
    throw unauthorized("Refresh token is required");
  }

  const result = await refreshService(refreshToken);
  context.set.headers["set-cookie"] = buildAuthCookies(
    result.token,
    result.refreshToken,
    result.expiredToken
  ) as any;

  logger.info("POST /api/v1/auth/refresh", { userId: result.user.id });
  return successResponse(200, "Refresh success", result);
};


