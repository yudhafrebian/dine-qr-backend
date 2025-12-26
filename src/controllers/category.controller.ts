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
}

export default CategoryController;
