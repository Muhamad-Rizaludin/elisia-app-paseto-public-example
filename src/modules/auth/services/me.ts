import { unauthorized } from "@common/errorFactory";
import { findUserByIdRepository } from "@modules/auth/repositories";

export const meService = async (userId: string) => {
  const user = await findUserByIdRepository(userId);
  if (!user) {
    throw unauthorized();
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: (user as any).role?.name ?? "user"
  };
};
