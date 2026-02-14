import { badRequest } from "@common/errorFactory";

const durationMap: Record<string, number> = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400
};

export const parseDurationToSeconds = (value: string, fallbackSeconds: number): number => {
  if (!value) return fallbackSeconds;
  if (/^\d+$/.test(value)) return Number(value);

  const matched = value.match(/^(\d+)([smhd])$/i);
  if (!matched) return fallbackSeconds;

  const amount = Number(matched[1]);
  const unit = matched[2].toLowerCase();
  return amount * durationMap[unit];
};

export const addSeconds = (seconds: number): Date => {
  return new Date(Date.now() + seconds * 1000);
};

export const assertNotExpired = (unixSeconds: number): void => {
  const now = Math.floor(Date.now() / 1000);
  if (unixSeconds <= now) {
    throw badRequest("Token is expired");
  }
};
