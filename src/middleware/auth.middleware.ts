import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/Response";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  const response = new ApiResponse(res);

  if (!token) {
    return response.unauthorized("Unauthorized, Please Login First");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return response.unauthorized("Token Expired");
  }
};
