import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/Response";
import { RestaurantServices } from "../services/restaurant.service";

class RestaurantController {
  async GetAllRestaurants(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const data = await RestaurantServices.getAllRestaurants();
      response.success(200, "Get All Restaurants Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async GetRestaurantById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const { id } = req.params;
      const data = await RestaurantServices.getRestaurantById(Number(id));
      response.success(200, "Get Restaurant By Id Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async UpdateRestaurant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const restaurantId = req.user.restaurantId;

      const updateData = req.body;
      const data = await RestaurantServices.update(restaurantId, updateData);
      response.success(200, "Update Restaurant Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async StatusUpdate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const id = req.user.restaurantId;
      const data = await RestaurantServices.statusUpdate(
        Number(id),
        req.body.isActive,
      );
      response.success(200, "Status Update Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async DeleteRestaurant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const response = new ApiResponse(res);
      const id = req.user.restaurantId;
      const data = await RestaurantServices.delete(Number(id));
      response.success(200, "Delete Restaurant Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default RestaurantController;
