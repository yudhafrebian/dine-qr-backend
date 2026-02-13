import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { OrderServices } from "../services/order.service";

class KitchenController {
  async GetAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const restaurantId = req.user.restaurantId;
      const data = await OrderServices.getAllPaidOrders(restaurantId);
      response.success(200, "Orders retrieved successfully", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default KitchenController;