import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: any) =>
  jwt.sign(payload, process.env.ACCESS_SECRET!, { expiresIn: "30m" });

export const generateRefreshToken = (payload: any) =>
  jwt.sign(payload, process.env.REFRESH_SECRET!, { expiresIn: "30d" });