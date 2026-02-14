import { beforeEach, describe, expect, it, mock } from "bun:test";

const calls = {
  userFindAndCountAll: [] as unknown[][]
};

const state = {
  userFindAndCountAll: {
    count: 0,
    rows: []
  } as any
};

const User = {
  findAndCountAll: async (...args: unknown[]) => {
    calls.userFindAndCountAll.push(args);
    return state.userFindAndCountAll;
  }
};

mock.module("@schemas/models", () => ({
  User,
  Role: {}
}));

const { findUsersWithPaginationRepository } = await import("@modules/users/repositories/findUsersWithPagination");

beforeEach(() => {
  calls.userFindAndCountAll = [];
});

describe("users repositories", () => {
  it("findUsersWithPaginationRepository calls User.findAndCountAll", async () => {
    await findUsersWithPaginationRepository({ offset: 0, limit: 10, search: "admin" });

    expect(calls.userFindAndCountAll.length).toBe(1);
    const options = calls.userFindAndCountAll[0]?.[0] as any;
    expect(options.offset).toBe(0);
    expect(options.limit).toBe(10);
  });
});
