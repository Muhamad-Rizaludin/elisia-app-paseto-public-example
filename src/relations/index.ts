import { applyAuthRelations } from "@relations/auth";
import { applyUsersRelations } from "@relations/users";

export const applyRelations = () => {
  applyUsersRelations();
  applyAuthRelations();
};
