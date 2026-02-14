import { User } from "@schemas/models";

export const createUserRepository = async (payload: {
  roleId: string;
  name: string;
  email: string;
  password: string;
}) => {
  return User.create(payload);
};
