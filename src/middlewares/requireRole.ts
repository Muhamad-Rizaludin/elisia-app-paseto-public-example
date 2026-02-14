import { forbidden, unauthorized } from "@common/errorFactory";

export const requireRole = (allowedRoles: string[]) => {
  return (context: any) => {
    const authUser = (context as any).authUser;
    if (!authUser) throw unauthorized();
    if (!allowedRoles.includes(authUser.role)) {
      throw forbidden("You do not have permission to access this resource");
    }
  };
};
