import { beforeEach, describe, expect, it, mock } from "bun:test";
import { appConfig } from "@config/app";

const calls = {
  findUserByEmailRepository: [] as unknown[][],
  findRoleByNameRepository: [] as unknown[][],
  createUserRepository: [] as unknown[][],
  createRefreshTokenRepository: [] as unknown[][],
  findRefreshTokenByTokenIdRepository: [] as unknown[][],
  revokeRefreshTokenByTokenIdRepository: [] as unknown[][],
  revokeRefreshTokensBySessionIdRepository: [] as unknown[][],
  findUserByIdRepository: [] as unknown[][],
  hashPassword: [] as unknown[][],
  hashValue: [] as unknown[][],
  comparePassword: [] as unknown[][],
  compareValue: [] as unknown[][],
  signAccessToken: [] as unknown[][],
  signRefreshToken: [] as unknown[][],
  verifyRefreshToken: [] as unknown[][]
};

const state = {
  findUserByEmailRepository: null as any,
  findRoleByNameRepository: { id: "role-user", name: "user" } as any,
  createUserRepository: { id: "user-1", name: "Tester", email: "tester@example.com" } as any,
  createRefreshTokenRepository: {} as any,
  findRefreshTokenByTokenIdRepository: null as any,
  revokeRefreshTokenByTokenIdRepository: [1] as any,
  revokeRefreshTokensBySessionIdRepository: [1] as any,
  findUserByIdRepository: null as any,
  hashPassword: "hashed-password",
  hashValue: "hashed-value",
  comparePassword: true,
  compareValue: true,
  signAccessToken: "access-token",
  signRefreshToken: "refresh-token",
  verifyRefreshToken: {
    userId: "user-1",
    role: "user",
    sessionId: "session-1",
    tokenId: "token-old",
    exp: Math.floor(Date.now() / 1000) + 3600
  } as any
};

const resetCalls = () => {
  for (const key of Object.keys(calls) as (keyof typeof calls)[]) {
    calls[key] = [];
  }
};

mock.module("@modules/auth/repositories", () => ({
  findUserByEmailRepository: async (...args: unknown[]) => {
    calls.findUserByEmailRepository.push(args);
    return state.findUserByEmailRepository;
  },
  findRoleByNameRepository: async (...args: unknown[]) => {
    calls.findRoleByNameRepository.push(args);
    return state.findRoleByNameRepository;
  },
  createUserRepository: async (...args: unknown[]) => {
    calls.createUserRepository.push(args);
    return state.createUserRepository;
  },
  createRefreshTokenRepository: async (...args: unknown[]) => {
    calls.createRefreshTokenRepository.push(args);
    return state.createRefreshTokenRepository;
  },
  findRefreshTokenByTokenIdRepository: async (...args: unknown[]) => {
    calls.findRefreshTokenByTokenIdRepository.push(args);
    return state.findRefreshTokenByTokenIdRepository;
  },
  revokeRefreshTokenByTokenIdRepository: async (...args: unknown[]) => {
    calls.revokeRefreshTokenByTokenIdRepository.push(args);
    return state.revokeRefreshTokenByTokenIdRepository;
  },
  revokeRefreshTokensBySessionIdRepository: async (...args: unknown[]) => {
    calls.revokeRefreshTokensBySessionIdRepository.push(args);
    return state.revokeRefreshTokensBySessionIdRepository;
  },
  findUserByIdRepository: async (...args: unknown[]) => {
    calls.findUserByIdRepository.push(args);
    return state.findUserByIdRepository;
  }
}));

mock.module("@utils/hash", () => ({
  hashPassword: async (...args: unknown[]) => {
    calls.hashPassword.push(args);
    return state.hashPassword;
  },
  hashValue: async (...args: unknown[]) => {
    calls.hashValue.push(args);
    return state.hashValue;
  },
  comparePassword: async (...args: unknown[]) => {
    calls.comparePassword.push(args);
    return state.comparePassword;
  },
  compareValue: async (...args: unknown[]) => {
    calls.compareValue.push(args);
    return state.compareValue;
  }
}));

mock.module("@utils/token", () => ({
  signAccessToken: async (...args: unknown[]) => {
    calls.signAccessToken.push(args);
    return state.signAccessToken;
  },
  signRefreshToken: async (...args: unknown[]) => {
    calls.signRefreshToken.push(args);
    return state.signRefreshToken;
  },
  verifyRefreshToken: async (...args: unknown[]) => {
    calls.verifyRefreshToken.push(args);
    return state.verifyRefreshToken;
  }
}));

const { registerService } = await import("@modules/auth/services/register");
const { loginService } = await import("@modules/auth/services/login");
const { refreshService } = await import("@modules/auth/services/refresh");
const { logoutService } = await import("@modules/auth/services/logout");
const { meService } = await import("@modules/auth/services/me");

beforeEach(() => {
  resetCalls();
  state.findUserByEmailRepository = null;
  state.findRoleByNameRepository = { id: "role-user", name: "user" };
  state.createUserRepository = { id: "user-1", name: "Tester", email: "tester@example.com" };
  state.createRefreshTokenRepository = {};
  state.findRefreshTokenByTokenIdRepository = null;
  state.revokeRefreshTokenByTokenIdRepository = [1];
  state.revokeRefreshTokensBySessionIdRepository = [1];
  state.findUserByIdRepository = null;
  state.hashPassword = "hashed-password";
  state.hashValue = "hashed-value";
  state.comparePassword = true;
  state.compareValue = true;
  state.signAccessToken = "access-token";
  state.signRefreshToken = "refresh-token";
  state.verifyRefreshToken = {
    userId: "user-1",
    role: "user",
    sessionId: "session-1",
    tokenId: "token-old",
    exp: Math.floor(Date.now() / 1000) + 3600
  };
});

describe("auth services", () => {
  it("registerService creates user and token", async () => {
    const result = await registerService({
      name: "Tester",
      email: "tester@example.com",
      password: "Password123"
    });

    expect(calls.findUserByEmailRepository.length).toBe(1);
    expect(calls.createUserRepository.length).toBe(1);
    expect(calls.createRefreshTokenRepository.length).toBe(1);
    expect(result.user.email).toBe("tester@example.com");
    expect(result.expiredToken).toBe(appConfig.auth.accessTokenTtlSeconds);
  });

  it("registerService throws when email exists", async () => {
    state.findUserByEmailRepository = { id: "existing-user" };

    await expect(
      registerService({
        name: "Tester",
        email: "tester@example.com",
        password: "Password123"
      })
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("loginService returns auth payload", async () => {
    state.findUserByEmailRepository = {
      id: "user-2",
      name: "Admin",
      email: "admin@example.com",
      password: "hashed",
      role: { name: "admin" }
    };

    const result = await loginService({ email: "admin@example.com", password: "Password123" });

    expect(calls.comparePassword.length).toBe(1);
    expect(calls.createRefreshTokenRepository.length).toBe(1);
    expect(result.user.role).toBe("admin");
  });

  it("loginService throws when credential invalid", async () => {
    state.findUserByEmailRepository = null;

    await expect(loginService({ email: "x@example.com", password: "wrong" })).rejects.toMatchObject({
      statusCode: 401
    });
  });

  it("refreshService rotates token", async () => {
    state.findRefreshTokenByTokenIdRepository = {
      tokenId: "token-old",
      tokenHash: "hash-old",
      revokedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      sessionStartedAt: new Date(Date.now() - 60_000)
    };
    state.findUserByIdRepository = {
      id: "user-1",
      name: "User",
      email: "user@example.com",
      role: { name: "user" }
    };
    state.signAccessToken = "access-new";
    state.signRefreshToken = "refresh-new";

    const result = await refreshService("refresh-old");

    expect(calls.revokeRefreshTokenByTokenIdRepository.length).toBe(1);
    expect(calls.createRefreshTokenRepository.length).toBe(1);
    expect(result.token).toBe("access-new");
  });

  it("refreshService throws when stored token missing", async () => {
    state.findRefreshTokenByTokenIdRepository = null;

    await expect(refreshService("refresh-old")).rejects.toMatchObject({ statusCode: 401 });
  });

  it("logoutService revokes by session", async () => {
    state.verifyRefreshToken = { sessionId: "session-2" };

    await logoutService("refresh-token");

    expect(calls.revokeRefreshTokensBySessionIdRepository.length).toBe(1);
    expect(calls.revokeRefreshTokensBySessionIdRepository[0]?.[0]).toBe("session-2");
  });

  it("meService returns mapped current user", async () => {
    state.findUserByIdRepository = {
      id: "user-3",
      name: "My User",
      email: "my-user@example.com",
      role: { name: "admin" }
    };

    const result = await meService("user-3");

    expect(result).toEqual({
      id: "user-3",
      name: "My User",
      email: "my-user@example.com",
      role: "admin"
    });
  });

  it("meService throws when user not found", async () => {
    state.findUserByIdRepository = null;

    await expect(meService("missing")).rejects.toMatchObject({ statusCode: 401 });
  });
});
