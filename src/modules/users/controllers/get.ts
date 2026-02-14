import { logger } from "@config/logger";
import { successResponse } from "@common/baseResponse";
import { getUsersService } from "@modules/users/services/get";

export const getUsersController = async (context: any) => {
  const result = await getUsersService(context.query ?? {});

  logger.info("GET /api/v1/users", {
    requestedBy: (context as any).authUser?.userId,
    page: result.meta.currentPage,
    pageSize: result.meta.pageSize
  });

  return successResponse(200, "Fetch users success", result.rows, result.meta);
};


