import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type Sequelize } from "sequelize";

export class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
  declare id: string;
  declare userId: string;
  declare sessionId: string;
  declare tokenId: string;
  declare tokenHash: string;
  declare sessionStartedAt: Date;
  declare expiresAt: Date;
  declare revokedAt: Date | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initRefreshTokenModel = (sequelize: Sequelize) => {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id"
      },
      sessionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "session_id"
      },
      tokenId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "token_id",
        unique: true
      },
      tokenHash: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "token_hash"
      },
      sessionStartedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "session_started_at",
        defaultValue: DataTypes.NOW
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "expires_at"
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "revoked_at"
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
      tableName: "refresh_tokens",
      modelName: "RefreshToken",
      timestamps: true,
      underscored: true
    }
  );
};
