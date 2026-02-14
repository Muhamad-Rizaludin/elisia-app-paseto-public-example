import { appConfig } from "@config/app";
import { unauthorized } from "@common/errorFactory";
import { verifyAccessToken } from "@utils/token";

const extractBearerToken = (authorization: string | null): string | null => {
  if (!authorization) return null;
  const [type, token] = authorization.split(" ");
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
};

export const requireAuth = async (context: any) => {
  const bearer = extractBearerToken(context.request.headers.get("authorization"));
  const cookieToken = context.cookie?.[appConfig.auth.accessTokenCookieName]?.value;
  const token = bearer || cookieToken;

  if (!token) {
    throw unauthorized();
  }

  const payload = await verifyAccessToken(token);
  (context as any).authUser = payload;
};
