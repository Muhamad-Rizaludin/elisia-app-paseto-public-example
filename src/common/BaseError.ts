export class BaseError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code = "INTERNAL_SERVER_ERROR", details?: unknown) {
    super(message);
    this.name = "BaseError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}
