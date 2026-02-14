import { logger } from "@config/logger";
import { successResponse } from "@common/baseResponse";
import { buildAuthCookies } from "@utils/cookies";
import { registerService } from "@modules/auth/services/register";

export const registerController = async (context: any) => {
  const result = await registerService(context.body);
  context.set.status = 201;
  context.set.headers["set-cookie"] = buildAuthCookies(
    result.token,
    result.refreshToken,
    result.expiredToken
  ) as any;

  logger.info("POST /api/v1/auth/register", { userId: result.user.id });
  return successResponse(201, "Register success", result);
};


