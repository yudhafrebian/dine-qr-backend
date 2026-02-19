// src/middlewares/role.middleware.ts
import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/Response";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res);

    
    
    const user = (req as any).user;


    if (!user) {
      return response.error(401, "Unauthorized: No user data found");
    }

    if (!allowedRoles.includes(user.role)) {
      return response.error(403, "Forbidden: You don't have permission to access this resource");
    }

    next();
  };
};