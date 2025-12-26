import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { UserService } from "../services/user.service";

class UserController {
  async GetAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const data = await UserService.getAllUsers();
      response.success(200, "Get All Users Success", data);
    } catch (error) {
        console.log(error);
        next(error);
    }
  }

  async GetUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await UserService.getUserById(Number(id));
      response.success(200, "Get User By Id Success", data);
    } catch (error) {
        console.log(error);
        next(error);
    }
  }

  async UpdateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await UserService.updateUser(Number(id), req.body);
      response.success(200, "Update User Success", data);
    } catch (error) {
        console.log(error);
        next(error);
    }
  }

  async DeleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await UserService.deleteUser(Number(id));
      response.success(200, "Delete User Success", data);
    } catch (error) {
        console.log(error);
        next(error);
    }
  }

  async RestoreUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await UserService.restoreUser(Number(id));
      response.success(200, "Restore User Success", data);
    } catch (error) {
        console.log(error);
        next(error);
    }
  }
}

export default UserController;