import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { UserServices } from "../services/user.service";

class UserController {
  async GetAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const data = await UserServices.getAllUsers();
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
      const data = await UserServices.getUserById(Number(id));
      response.success(200, "Get User By Id Success", data);
    } catch (error) {
        console.log(error);
        next(error);
    }
  }

  async RegisterUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const restaurantId = req.user.restaurantId;
      const data = await UserServices.registerUser({ ...req.body, restaurantId });
      response.success(200, "Register User Success", data);
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
      const data = await UserServices.updateUser(Number(id), req.body);
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
      const data = await UserServices.deleteUser(Number(id));
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
      const data = await UserServices.restoreUser(Number(id));
      response.success(200, "Restore User Success", data);
    } catch (error) {
        console.log(error);
        next(error);
    }
  }
}

export default UserController;