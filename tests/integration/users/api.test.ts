import { afterEach, describe, expect, it, mock } from "bun:test";

afterEach(() => {
  mock.restore();
});

describe("users api", () => {
  it("GET /api/v1/users returns mocked success response", async () => {
    mock.module("@middlewares/requireAuth", () => ({
      requireAuth: (context: any) => {
        (context as any).authUser = { userId: "admin", role: "admin" };
      }
    }));

    mock.module("@middlewares/requireRole", () => ({
      requireRole: () => () => undefined
    }));

    mock.module("@modules/users/controllers/get", () => ({
      getUsersController: () => ({
        status: 200,
        success: true,
        message: "Fetch users success",
        data: [],
        meta: {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          totalPage: 0,
          hasNext: false,
          hasPrev: false
        }
      })
    }));

    const { createApp } = await import("@config/bootstrap");
    const app = createApp();

    const response = await app.handle(new Request("http://localhost/api/v1/users"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Fetch users success");
  });
});
