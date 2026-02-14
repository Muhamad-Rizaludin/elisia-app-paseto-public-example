import { RefreshToken } from "@schemas/models";

export const revokeRefreshTokenByTokenIdRepository = async (tokenId: string) => {
  return RefreshToken.update(
    { revokedAt: new Date() },
    {
      where: { tokenId }
    }
  );
};
