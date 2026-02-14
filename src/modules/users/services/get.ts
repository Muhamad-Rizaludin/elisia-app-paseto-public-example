import { buildMeta } from "@common/baseResponse";
import { parsePaginationQuery } from "@common/pagination";
import { findUsersWithPaginationRepository } from "@modules/users/repositories";

export const getUsersService = async (query: Record<string, unknown>) => {
  const { page, pageSize, offset, search } = parsePaginationQuery(query);
  const result = await findUsersWithPaginationRepository({
    offset,
    limit: pageSize,
    search
  });

  return {
    rows: result.rows.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name ?? "user",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })),
    meta: buildMeta(page, pageSize, result.count)
  };
};

