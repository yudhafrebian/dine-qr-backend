import { Router } from "express";
import RestaurantController from "../controllers/restaurant.controller";
import { authMiddleware } from "../middleware/auth.middleware";

class RestaurantRouter {
    #route: Router;
    #restaurantController: RestaurantController;
    constructor(){
        this.#route = Router();
        this.#restaurantController = new RestaurantController();
        this.#initializeRoutes();
    }
    #initializeRoutes(){
        this.#route.use(authMiddleware);
        this.#route.get("/", this.#restaurantController.GetAllRestaurants);
        this.#route.get("/:id", this.#restaurantController.GetRestaurantById);
        this.#route.patch("/", this.#restaurantController.UpdateRestaurant);
        this.#route.patch("/status", this.#restaurantController.StatusUpdate);
        this.#route.patch("/delete", this.#restaurantController.DeleteRestaurant);
    }
    getRouter(): Router {
        return this.#route;
    }
}

export default RestaurantRouter;