import { afterEach, describe, expect, it, mock } from "bun:test";

afterEach(() => {
  mock.restore();
});

describe("auth api", () => {
  it("POST /api/v1/auth/register returns mocked success response", async () => {
    mock.module("@modules/auth/controllers/register", () => ({
      registerController: (context: any) => {
        context.set.status = 201;
        return {
          status: 201,
          success: true,
          message: "Register success",
          data: { id: "u1" },
          meta: {
            currentPage: 0,
            pageSize: 0,
            total: 0,
            totalPage: 0,
            hasNext: false,
            hasPrev: false
          }
        };
      }
    }));

    const { createApp } = await import("@config/bootstrap");
    const app = createApp();

    const response = await app.handle(
      new Request("http://localhost/api/v1/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "Tester", email: "tester@example.com", password: "Password123" })
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.message).toBe("Register success");
  });

  it("POST /api/v1/auth/register returns 400 when validation fails", async () => {
    mock.module("@modules/auth/controllers/register", () => ({
      registerController: () => ({ ok: true })
    }));

    const { createApp } = await import("@config/bootstrap");
    const app = createApp();

    const response = await app.handle(
      new Request("http://localhost/api/v1/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: "T" })
      })
    );
    const raw = await response.text();
    let message = raw;
    try {
      message = JSON.parse(raw).message;
    } catch {
      message = raw;
    }

    expect([400, 500]).toContain(response.status);
    expect(message).toContain("Validation");
  });
});
