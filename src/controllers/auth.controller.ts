import { NextFunction, Request, response, Response } from "express";
import { AuthServices } from "../services/auth.service";
import { cookieOptions, refreshCookieOptions } from "../utils/cookies";
import ApiResponse from "../utils/Response";

class AuthController {
  async Login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { email, password } = req.body;
      const data = await AuthServices.login(email, password);
      res.cookie("access_token", data?.accessToken, cookieOptions);
      res.cookie("refresh_token", data?.refreshToken, refreshCookieOptions);

      response.success(200, "Login Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async Register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const data = await AuthServices.register(req.body);
      response.success(200, "Register Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async Logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    const response = new ApiResponse(res);
    try {
      res.clearCookie("access_token",cookieOptions);
      res.clearCookie("refresh_token",refreshCookieOptions);
      response.success(200, "Logout Success");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default AuthController;
