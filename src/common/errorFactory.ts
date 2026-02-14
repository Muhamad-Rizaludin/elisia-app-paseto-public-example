import { BaseError } from "@common/BaseError";

export const badRequest = (message: string, details?: unknown) =>
  new BaseError(message, 400, "BAD_REQUEST", details);

export const unauthorized = (message = "Unauthorized") =>
  new BaseError(message, 401, "UNAUTHORIZED");

export const forbidden = (message = "Forbidden") =>
  new BaseError(message, 403, "FORBIDDEN");

export const notFound = (message = "Not found") =>
  new BaseError(message, 404, "NOT_FOUND");

export const conflict = (message: string, details?: unknown) =>
  new BaseError(message, 409, "CONFLICT", details);

export const tooManyRequests = (message = "Too many requests") =>
  new BaseError(message, 429, "TOO_MANY_REQUESTS");

export const internalError = (message = "Internal server error", details?: unknown) =>
  new BaseError(message, 500, "INTERNAL_SERVER_ERROR", details);
