import bcrypt from "bcrypt";

export const hashPassword = async (password: string): Promise<string> => {
  if (!password) {
    throw new Error("Password parameter is missing");
  }

  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};
