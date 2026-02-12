import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { SubscriptionService } from "../services/subscription.service";

class SubscriptionController {
  async CreatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const { id, restaurantId } = req.user;
      const { planId } = req.body;
      const payment = await SubscriptionService.createPayment({
        restaurantId,
        planId,
        userId: id,
      });
      response.success(201, "Payment created", payment);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default SubscriptionController;