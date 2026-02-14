import { logger } from "@config/logger";
import { successResponse } from "@common/baseResponse";
import { meService } from "@modules/auth/services/me";

export const meController = async (context: any) => {
  const authUser = (context as any).authUser;
  const me = await meService(authUser.userId);

  logger.info("GET /api/v1/auth/me", { userId: me.id });
  return successResponse(200, "Fetch current user success", me);
};


