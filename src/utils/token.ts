import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: any) =>
  jwt.sign(payload, process.env.ACCESS_SECRET!, { expiresIn: "30m" });

export const generateRefreshToken = (payload: any) =>
  jwt.sign(payload, process.env.REFRESH_SECRET!, { expiresIn: "30d" });

export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.REFRESH_SECRET!) as {
      id: number;
      role: "SUPERADMIN" | "ADMIN" | "CASHIER" | "KITCHEN";
      restaurandId: number;
    };
  } catch (error) {
    throw new Error("Invalid Refresh Token");
  }
};
