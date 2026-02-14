import { appConfig } from "@config/app";
import { logger } from "@config/logger";
import { unauthorized } from "@common/errorFactory";
import { successResponse } from "@common/baseResponse";
import { buildClearAuthCookies } from "@utils/cookies";
import { logoutService } from "@modules/auth/services/logout";

export const logoutController = async (context: any) => {
  const bodyRefreshToken = context.body?.refreshToken;
  const cookieRefreshToken = context.cookie?.[appConfig.auth.refreshTokenCookieName]?.value;
  const refreshToken = bodyRefreshToken || cookieRefreshToken;

  if (!refreshToken) {
    throw unauthorized("Refresh token is required");
  }

  await logoutService(refreshToken);
  context.set.headers["set-cookie"] = buildClearAuthCookies() as any;

  logger.info("POST /api/v1/auth/logout", {});
  return successResponse(200, "Logout success", null);
};


