import bcrypt from "bcryptjs";

export const hashValue = async (value: string): Promise<string> => {
  return bcrypt.hash(value, 10);
};

export const compareValue = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};

export const hashPassword = hashValue;
export const comparePassword = compareValue;
