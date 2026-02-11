import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { CategoryServices } from "../services/category.service";

class CategoryController {
  async GetCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const data = await CategoryServices.getAllCategory();
      response.success(200, "Get All Category Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async GetCategoryByRestaurandId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const restaurandId = req.user.restaurantId;
      const data = await CategoryServices.getAllByRestaurantId(
        restaurandId
      );
      response.success(200, "Get Category By Restaurand Id Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async GetCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await CategoryServices.getCategoryById(Number(id));
      response.success(200, "Get Category By Id Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async CreateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const restaurandId = req.user.restaurantId;
      const data = await CategoryServices.create({
        ...req.body,
        restaurantId: restaurandId,
      });
      response.success(200, "Create Category Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async UpdateCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await CategoryServices.update(Number(id), req.body);
      response.success(200, "Update Category Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async DeleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await CategoryServices.delete(Number(id));
      response.success(200, "Delete Category Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default CategoryController;
