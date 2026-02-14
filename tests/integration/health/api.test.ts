import { describe, expect, it } from "bun:test";
import { createApp } from "@config/bootstrap";

describe("health api", () => {
  it("GET /api/v1/health returns healthy response", async () => {
    const app = createApp();
    const response = await app.handle(new Request("http://localhost/api/v1/health"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe("healthy");
  });
});
