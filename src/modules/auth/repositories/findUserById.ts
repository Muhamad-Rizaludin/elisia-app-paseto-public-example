import { Role, User } from "@schemas/models";

export const findUserByIdRepository = async (id: string) => {
  return User.findByPk(id, {
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["id", "name"]
      }
    ]
  });
};
