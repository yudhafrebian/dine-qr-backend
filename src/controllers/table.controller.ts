import { NextFunction, Request, Response } from "express";
import { TableServices } from "../services/table.service";
import ApiResponse from "../utils/Response";
import { RestaurantRepository } from "../repositories/restaurant.repository";
import { ApiError } from "../utils/ApiError";
import { buildFrontendUrl } from "../utils/FePathBuilder";

class TableController {
  async GetAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const data = await TableServices.getAll();
      response.success(200, "Get All Table Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async GetAllByRestaurantId(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const restaurantId = req.user.restaurantId;

      console.log("Restaurant ID:", restaurantId);
      const data = await TableServices.getAllByRestaurantId(
        Number(restaurantId),
      );

      response.success(200, "Get All Table By Restaurant Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async GetTableById(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const restaurantId = req.user.restaurantId;
      const id = req.params.id;

      const data = await TableServices.getTableById(
        Number(id),
        Number(restaurantId),
      );
      response.success(200, "Get Table By Id Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async CreateTable(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);

      const restaurantId = req.user.restaurantId;
      const { tableNumber } = req.body;

      const restaurant = await RestaurantRepository.findById(restaurantId);
      if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
      }

      const payloadUrl = buildFrontendUrl(
        `/r/${restaurant.slug}/t/${tableNumber}`,
      );
      console.log("Payload URL:", payloadUrl);
      const data = await TableServices.create(
        {
          tableNumber,
          restaurantId,
        },
        payloadUrl,
      );
      response.success(200, "Create Table Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async UpdateTable(req: Request, res: Response, next: NextFunction) {
    try {
      const response = new ApiResponse(res);
      const restaurantId = req.user.restaurantId;
      const id = req.params.id;
      const data = await TableServices.update(
        Number(id),
        restaurantId,
        req.body,
      );
      response.success(200, "Update Table Success", data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default TableController;
