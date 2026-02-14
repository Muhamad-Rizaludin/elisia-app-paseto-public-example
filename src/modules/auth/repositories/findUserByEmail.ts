import { Role, User } from "@schemas/models";

export const findUserByEmailRepository = async (email: string) => {
  return User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: "role",
        attributes: ["id", "name"]
      }
    ]
  });
};
