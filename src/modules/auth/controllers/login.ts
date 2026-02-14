import { logger } from "@config/logger";
import { successResponse } from "@common/baseResponse";
import { buildAuthCookies } from "@utils/cookies";
import { loginService } from "@modules/auth/services/login";

export const loginController = async (context: any) => {
  const result = await loginService(context.body);
  context.set.headers["set-cookie"] = buildAuthCookies(
    result.token,
    result.refreshToken,
    result.expiredToken
  ) as any;

  logger.info("POST /api/v1/auth/login", { userId: result.user.id });
  return successResponse(200, "Login success", result);
};


