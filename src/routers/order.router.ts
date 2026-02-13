import { Router } from "express";
import OrderController from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

class OrderRouter {
    #route: Router;
    #orderController: OrderController;
    constructor() {
        this.#route = Router();
        this.#orderController = new OrderController();
        this.#initializeRoutes();
    }
    #initializeRoutes() {
        this.#route.post("/create/:restaurantId", this.#orderController.CreateOrder);
        this.#route.post("/webhook", roleMiddleware(["SUPER_ADMIN"]), this.#orderController.handleMidtransWebhook);
    }
    getRouter(): Router {
        return this.#route;
    }
}

export default OrderRouter;