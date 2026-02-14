import type { Sequelize } from "sequelize";
import { Role, initRoleModel } from "@schemas/models/Role";
import { User, initUserModel } from "@schemas/models/User";
import { RefreshToken, initRefreshTokenModel } from "@schemas/models/RefreshToken";

export { Role, User, RefreshToken };

export const initModels = (sequelize: Sequelize) => {
  initRoleModel(sequelize);
  initUserModel(sequelize);
  initRefreshTokenModel(sequelize);
};
