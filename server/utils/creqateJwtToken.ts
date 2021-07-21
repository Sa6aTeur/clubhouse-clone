import jwt from "jsonwebtoken";
import { UserData } from "../../pages";

interface ILoginData {
  email: string;
  password: string;
}

export const createJwtWebToken = (user: Omit<UserData, 'id'>): string => {
  const token = jwt.sign(
    {
      data: user,
    },
    process.env.JWT_SECRET_KEY || "",
    {
      expiresIn: process.env.JWT_MAX_AGE,
      algorithm: "HS256",
    }
  );

  return token;
};