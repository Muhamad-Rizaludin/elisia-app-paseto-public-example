import { beforeEach, describe, expect, it, mock } from "bun:test";

const calls = {
  roleFindOne: [] as unknown[][],
  userCreate: [] as unknown[][],
  userFindOne: [] as unknown[][],
  userFindByPk: [] as unknown[][],
  refreshCreate: [] as unknown[][],
  refreshFindOne: [] as unknown[][],
  refreshUpdate: [] as unknown[][]
};

const state = {
  roleFindOne: { id: "role-1" } as any,
  userCreate: { id: "user-1" } as any,
  userFindOne: { id: "user-2" } as any,
  userFindByPk: { id: "user-3" } as any,
  refreshCreate: { id: "rt-1" } as any,
  refreshFindOne: { id: "rt-2" } as any,
  refreshUpdate: [1] as any
};

const Role = {
  findOne: async (...args: unknown[]) => {
    calls.roleFindOne.push(args);
    return state.roleFindOne;
  }
};

const User = {
  create: async (...args: unknown[]) => {
    calls.userCreate.push(args);
    return state.userCreate;
  },
  findOne: async (...args: unknown[]) => {
    calls.userFindOne.push(args);
    return state.userFindOne;
  },
  findByPk: async (...args: unknown[]) => {
    calls.userFindByPk.push(args);
    return state.userFindByPk;
  }
};

const RefreshToken = {
  create: async (...args: unknown[]) => {
    calls.refreshCreate.push(args);
    return state.refreshCreate;
  },
  findOne: async (...args: unknown[]) => {
    calls.refreshFindOne.push(args);
    return state.refreshFindOne;
  },
  update: async (...args: unknown[]) => {
    calls.refreshUpdate.push(args);
    return state.refreshUpdate;
  }
};

mock.module("@schemas/models", () => ({
  Role,
  User,
  RefreshToken
}));

const { findRoleByNameRepository } = await import("@modules/auth/repositories/findRoleByName");
const { createUserRepository } = await import("@modules/auth/repositories/createUser");
const { findUserByEmailRepository } = await import("@modules/auth/repositories/findUserByEmail");
const { findUserByIdRepository } = await import("@modules/auth/repositories/findUserById");
const { createRefreshTokenRepository } = await import("@modules/auth/repositories/createRefreshToken");
const { findRefreshTokenByTokenIdRepository } = await import(
  "@modules/auth/repositories/findRefreshTokenByTokenId"
);
const { revokeRefreshTokenByTokenIdRepository } = await import(
  "@modules/auth/repositories/revokeRefreshTokenByTokenId"
);
const { revokeRefreshTokensBySessionIdRepository } = await import(
  "@modules/auth/repositories/revokeRefreshTokensBySessionId"
);

beforeEach(() => {
  for (const key of Object.keys(calls) as (keyof typeof calls)[]) {
    calls[key] = [];
  }
});

describe("auth repositories", () => {
  it("findRoleByNameRepository calls Role.findOne", async () => {
    await findRoleByNameRepository("admin");

    expect(calls.roleFindOne.length).toBe(1);
    expect(calls.roleFindOne[0]?.[0]).toEqual({ where: { name: "admin" } });
  });

  it("createUserRepository calls User.create", async () => {
    await createUserRepository({
      roleId: "role-1",
      name: "Tester",
      email: "tester@example.com",
      password: "hashed"
    });

    expect(calls.userCreate.length).toBe(1);
  });

  it("findUserByEmailRepository calls User.findOne", async () => {
    await findUserByEmailRepository("admin@example.com");

    expect(calls.userFindOne.length).toBe(1);
    expect(calls.userFindOne[0]?.[0]).toMatchObject({ where: { email: "admin@example.com" } });
  });

  it("findUserByIdRepository calls User.findByPk", async () => {
    await findUserByIdRepository("user-3");

    expect(calls.userFindByPk.length).toBe(1);
    expect(calls.userFindByPk[0]?.[0]).toBe("user-3");
  });

  it("createRefreshTokenRepository calls RefreshToken.create", async () => {
    await createRefreshTokenRepository({
      userId: "user-1",
      sessionId: "session-1",
      tokenId: "token-1",
      tokenHash: "hash",
      expiresAt: new Date(),
      sessionStartedAt: new Date()
    });

    expect(calls.refreshCreate.length).toBe(1);
  });

  it("findRefreshTokenByTokenIdRepository calls RefreshToken.findOne", async () => {
    await findRefreshTokenByTokenIdRepository("token-2");

    expect(calls.refreshFindOne.length).toBe(1);
    expect(calls.refreshFindOne[0]?.[0]).toEqual({ where: { tokenId: "token-2" } });
  });

  it("revokeRefreshTokenByTokenIdRepository calls RefreshToken.update", async () => {
    await revokeRefreshTokenByTokenIdRepository("token-3");

    expect(calls.refreshUpdate.length).toBe(1);
    expect(calls.refreshUpdate[0]?.[1]).toEqual({ where: { tokenId: "token-3" } });
  });

  it("revokeRefreshTokensBySessionIdRepository calls RefreshToken.update", async () => {
    await revokeRefreshTokensBySessionIdRepository("session-3");

    expect(calls.refreshUpdate.length).toBe(1);
    expect(calls.refreshUpdate[0]?.[1]).toEqual({ where: { sessionId: "session-3" } });
  });
});
