import { Role, User } from "@schemas/models";

export const applyUsersRelations = () => {
  Role.hasMany(User, {
    foreignKey: "roleId",
    sourceKey: "id",
    as: "users"
  });

  User.belongsTo(Role, {
    foreignKey: "roleId",
    targetKey: "id",
    as: "role"
  });
};
