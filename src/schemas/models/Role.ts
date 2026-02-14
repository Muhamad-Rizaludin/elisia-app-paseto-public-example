import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type Sequelize } from "sequelize";

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initRoleModel = (sequelize: Sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "updated_at"
      }
    },
    {
      sequelize,
      tableName: "roles",
      modelName: "Role",
      timestamps: true,
      underscored: true
    }
  );
};
