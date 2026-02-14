import * as yup from "yup";

export const usersQuerySchema = yup.object({
  page: yup.number().integer().min(1).optional(),
  pageSize: yup.number().integer().min(1).max(100).optional(),
  search: yup.string().max(100).optional()
});
