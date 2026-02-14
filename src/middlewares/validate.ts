import type { AnyObjectSchema } from "yup";
import { badRequest } from "@common/errorFactory";

export const validateBody = (schema: AnyObjectSchema) => {
  return async (context: any) => {
    try {
      context.body = await schema.validate(context.body, {
        abortEarly: false,
        stripUnknown: true
      });
    } catch (error: any) {
      throw badRequest("Validation error", error.errors ?? error.message);
    }
  };
};
