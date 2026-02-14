import { Op } from "sequelize";
import { Role, User } from "@schemas/models";

export const findUsersWithPaginationRepository = async (payload: {
  offset: number;
  limit: number;
  search?: string;
}) => {
  const where = payload.search
    ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${payload.search}%` } },
          { email: { [Op.iLike]: `%${payload.search}%` } }
        ]
      }
    : {};

  return User.findAndCountAll({
    where,
    offset: payload.offset,
    limit: payload.limit,
    order: [["createdAt", "DESC"]],
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["name"]
      }
    ]
  });
};
