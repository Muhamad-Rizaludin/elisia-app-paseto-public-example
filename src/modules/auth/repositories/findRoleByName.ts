import { Role } from "@schemas/models";

export const findRoleByNameRepository = async (name: string) => {
  return Role.findOne({ where: { name } });
};
