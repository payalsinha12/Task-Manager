import jwt, { Secret } from "jsonwebtoken";

const ACCESS_SECRET: Secret = process.env.JWT_SECRET || "mysecret";
const REFRESH_SECRET: Secret = process.env.REFRESH_SECRET || "refreshsecret";

export const generateAccessToken = (userId: number): string => {
  return jwt.sign({ userId }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (userId: number): string => {
  return jwt.sign({ userId }, REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyRefreshToken = (token: string): { userId: number } => {
  return jwt.verify(token, REFRESH_SECRET) as { userId: number };
};