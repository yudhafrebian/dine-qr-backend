import { Router } from "express";
import RestaurantController from "../controllers/restaurant.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

class RestaurantRouter {
  #route: Router;
  #restaurantController: RestaurantController;
  constructor() {
    this.#route = Router();
    this.#restaurantController = new RestaurantController();
    this.#initializeRoutes();
  }
  #initializeRoutes() {
    this.#route.use(authMiddleware);
    this.#route.get(
      "/",
      roleMiddleware(["SUPER_ADMIN"]),
      this.#restaurantController.GetAllRestaurants,
    );
    this.#route.get(
      "/:id",
      roleMiddleware(["SUPER_ADMIN"]),
      this.#restaurantController.GetRestaurantById,
    );
    this.#route.patch(
      "/",
      roleMiddleware(["ADMIN"]),
      this.#restaurantController.UpdateRestaurant,
    );
    this.#route.patch(
      "/status",
      roleMiddleware(["SUPER_ADMIN"]),
      this.#restaurantController.StatusUpdate,
    );
    this.#route.patch(
      "/delete",
      roleMiddleware(["SUPER_ADMIN"]),
      this.#restaurantController.DeleteRestaurant,
    );
  }
  getRouter(): Router {
    return this.#route;
  }
}

export default RestaurantRouter;
