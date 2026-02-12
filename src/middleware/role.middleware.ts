import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiResponse from "../utils/Response";

export const SuperAdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;
  const response = new ApiResponse(res);

  if (!token) {
    return response.unauthorized("Unauthorized, Please Login First");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    if (req.user.role !== "SUPER_ADMIN") {
      return response.unauthorized(
        "Forbidden, You don't have access to this resource",
      );
    }
    next();
  } catch (error) {
    return response.unauthorized("Token Expired");
  }
};

export const AdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;
  const response = new ApiResponse(res);

  if (!token) {
    return response.unauthorized("Unauthorized, Please Login First");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!);
    console.log("Decoded Token:", decoded);
    req.user = decoded;
    if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return response.unauthorized(
        "Forbidden, You don't have access to this resource",
      );
    }
    next();
  } catch (error) {
    return response.unauthorized("Token Expired");
  }
};
