import { NextFunction, request, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { OrderServices } from "../services/order.service";

class KitchenController {
  async GetAllOrders(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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

  async UpdateOrderStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { status } = req.body;
      const id = req.params.id;

      const update = await OrderServices.updateOrderStatus(
        Number(id),
        status,
      );

      response.success(200, "Order Updated", update);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default KitchenController;
