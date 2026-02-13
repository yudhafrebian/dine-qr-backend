import { Router } from "express";
import KitchenController from "../controllers/kitchen.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

class KitchenRouter {
    #route: Router;
    #kitcherController: KitchenController;
    constructor() {
        this.#route = Router();
        this.#kitcherController = new KitchenController();
        this.#initializeRoutes();
    }
    #initializeRoutes() {
        this.#route.use(authMiddleware);
        this.#route.use(roleMiddleware(["KITCHEN", "ADMIN", "SUPER_ADMIN"]));
        this.#route.get("/", this.#kitcherController.GetAllOrders);
    }
    getRouter(): Router {
        return this.#route;
    }
}

export default KitchenRouter;