import { beforeEach, describe, expect, it, mock } from "bun:test";

const calls = {
  findUsersWithPaginationRepository: [] as unknown[][]
};

const state = {
  findUsersWithPaginationRepository: {
    count: 1,
    rows: [
      {
        id: "user-1",
        name: "System Admin",
        email: "admin@example.com",
        role: { name: "admin" },
        createdAt: "2026-02-14T05:00:00.000Z",
        updatedAt: "2026-02-14T05:00:00.000Z"
      }
    ]
  } as any
};

mock.module("@modules/users/repositories", () => ({
  findUsersWithPaginationRepository: async (...args: unknown[]) => {
    calls.findUsersWithPaginationRepository.push(args);
    return state.findUsersWithPaginationRepository;
  }
}));

const { getUsersService } = await import("@modules/users/services/get");

beforeEach(() => {
  calls.findUsersWithPaginationRepository = [];
});

describe("users services", () => {
  it("getUsersService maps rows and meta", async () => {
    const result = await getUsersService({ page: "1", pageSize: "10" });

    expect(calls.findUsersWithPaginationRepository.length).toBe(1);
    expect(result.rows.length).toBe(1);
    expect(result.rows[0]?.role).toBe("admin");
    expect(result.meta.total).toBe(1);
  });
});
