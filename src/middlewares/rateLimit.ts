import { tooManyRequests } from "@common/errorFactory";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const memoryStore = new Map<string, RateLimitEntry>();

export const createRateLimiter = (keyPrefix: string, max: number, windowMs: number) => {
  return (context: any) => {
    const ip = context.request.headers.get("x-forwarded-for") || "unknown";
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    const existing = memoryStore.get(key);

    if (!existing || existing.resetAt <= now) {
      memoryStore.set(key, { count: 1, resetAt: now + windowMs });
      return;
    }

    if (existing.count >= max) {
      throw tooManyRequests("Too many requests, please try again later");
    }

    existing.count += 1;
    memoryStore.set(key, existing);
  };
};
