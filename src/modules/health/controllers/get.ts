import { successResponse } from "@common/baseResponse";
import { getHealthService } from "@modules/health/services/get";

export const getHealthController = async () => {
  return successResponse(200, "OK", getHealthService());
};

