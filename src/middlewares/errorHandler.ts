import { BaseError } from "@common/BaseError";
import { errorResponse } from "@common/baseResponse";
import { logger } from "@config/logger";

export const applyErrorHandler = (app: any) => {
  app.onError(({ error, set }: any) => {
    if (error instanceof BaseError) {
      set.status = error.statusCode;
      return errorResponse(error.statusCode, error.message);
    }

    logger.error("Unhandled error", { error });
    set.status = 500;
    return errorResponse(500, "Internal server error");
  });
};

