import { appConfig } from "@config/app";

const buildCookie = (
  name: string,
  value: string,
  maxAge: number,
  options: { secure: boolean; sameSite: string; httpOnly?: boolean }
): string => {
  const flags = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    `SameSite=${options.sameSite}`
  ];

  if (options.httpOnly !== false) flags.push("HttpOnly");
  if (options.secure) flags.push("Secure");

  return flags.join("; ");
};

export const buildAuthCookies = (token: string, refreshToken: string, expiredToken: number): string[] => {
  return [
    buildCookie(appConfig.auth.accessTokenCookieName, token, expiredToken, {
      secure: appConfig.cookie.secure,
      sameSite: appConfig.cookie.sameSite
    }),
    buildCookie(appConfig.auth.refreshTokenCookieName, refreshToken, appConfig.auth.sessionMaxAgeSeconds, {
      secure: appConfig.cookie.secure,
      sameSite: appConfig.cookie.sameSite
    }),
    buildCookie(appConfig.auth.expiredTokenCookieName, String(expiredToken), expiredToken, {
      secure: appConfig.cookie.secure,
      sameSite: appConfig.cookie.sameSite,
      httpOnly: false
    })
  ];
};

export const buildClearAuthCookies = (): string[] => {
  return [
    buildCookie(appConfig.auth.accessTokenCookieName, "", 0, {
      secure: appConfig.cookie.secure,
      sameSite: appConfig.cookie.sameSite
    }),
    buildCookie(appConfig.auth.refreshTokenCookieName, "", 0, {
      secure: appConfig.cookie.secure,
      sameSite: appConfig.cookie.sameSite
    }),
    buildCookie(appConfig.auth.expiredTokenCookieName, "", 0, {
      secure: appConfig.cookie.secure,
      sameSite: appConfig.cookie.sameSite,
      httpOnly: false
    })
  ];
};
