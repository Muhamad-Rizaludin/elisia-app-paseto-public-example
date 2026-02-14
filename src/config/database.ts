import { Sequelize } from "sequelize";
import { appConfig } from "@config/app";
import { initModels } from "@schemas/models";
import { applyRelations } from "@relations/index";

export const sequelize = new Sequelize(
  appConfig.db.database,
  appConfig.db.username,
  appConfig.db.password,
  {
    host: appConfig.db.host,
    port: appConfig.db.port,
    dialect: appConfig.db.dialect,
    logging: appConfig.db.logging
  }
);

export const initDatabase = async () => {
  initModels(sequelize);
  applyRelations();
  await sequelize.authenticate();
};
