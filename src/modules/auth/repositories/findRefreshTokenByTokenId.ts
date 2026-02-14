import { RefreshToken } from "@schemas/models";

export const findRefreshTokenByTokenIdRepository = async (tokenId: string) => {
  return RefreshToken.findOne({
    where: { tokenId }
  });
};
