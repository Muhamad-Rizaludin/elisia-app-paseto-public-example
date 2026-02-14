import { RefreshToken, User } from "@schemas/models";

export const applyAuthRelations = () => {
  User.hasMany(RefreshToken, {
    foreignKey: "userId",
    sourceKey: "id",
    as: "refreshTokens"
  });

  RefreshToken.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
    as: "user"
  });
};
