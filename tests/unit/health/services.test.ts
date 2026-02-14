import { describe, expect, it } from "bun:test";
import { getHealthService } from "@modules/health/services/get";

describe("health services", () => {
  it("getHealthService returns healthy payload", () => {
    const result = getHealthService();

    expect(result.status).toBe("healthy");
    expect(typeof result.uptime).toBe("number");
    expect(typeof result.timestamp).toBe("string");
  });
});
