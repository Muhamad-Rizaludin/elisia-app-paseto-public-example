import { badRequest } from "@common/errorFactory";

export const toPositiveInt = (value: unknown, fallback: number): number => {
  const numeric = Number(value ?? fallback);
  if (!Number.isFinite(numeric) || numeric <= 0) return fallback;
  return Math.floor(numeric);
};

export const parsePaginationQuery = (query: Record<string, unknown>) => {
  const page = toPositiveInt(query.page, 1);
  const pageSize = Math.min(toPositiveInt(query.pageSize, 10), 100);
  const offset = (page - 1) * pageSize;
  const search = typeof query.search === "string" ? query.search.trim() : "";

  if (page <= 0 || pageSize <= 0) {
    throw badRequest("Invalid pagination query");
  }

  return { page, pageSize, offset, search };
};
