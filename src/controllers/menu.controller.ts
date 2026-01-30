import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { MenuServices } from "../services/menu.service";

class MenuController {
  async GetAllMenu(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const data = await MenuServices.getAllMenu();
      response.success(200, "Get All Menu Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getMenuByRestaurantId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const restaurandId = req.user.restaurantId;
      const data = await MenuServices.getAllByRestaurantId(restaurandId);
      response.success(200, "Get Menu By Restaurand Id Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async GetMenuById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await MenuServices.getMenuById(Number(id));
      response.success(200, "Get Menu By Id Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async CreateMenu(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);

      const restaurantId = req.user.restaurantId;
      const file = req.file;

      const data = await MenuServices.create(
        {
          ...req.body,
          isAvailable: true,
          restaurantId,
        },
        file
      );
      response.success(200, "Create Menu Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async UpdateMenu(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await MenuServices.update(Number(id), req.body);
      response.success(200, "Update Menu Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async DeleteMenu(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await MenuServices.delete(Number(id));
      response.success(200, "Delete Menu Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default MenuController;
