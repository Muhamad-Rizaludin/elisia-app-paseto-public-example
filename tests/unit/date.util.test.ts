import { describe, expect, it } from "bun:test";
import { parseDurationToSeconds } from "@utils/date";

describe("parseDurationToSeconds", () => {
  it("parses hour string", () => {
    expect(parseDurationToSeconds("8h", 0)).toBe(28800);
  });

  it("returns fallback when invalid", () => {
    expect(parseDurationToSeconds("invalid", 60)).toBe(60);
  });
});
