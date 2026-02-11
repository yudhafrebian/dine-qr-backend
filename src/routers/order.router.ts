import { Router } from "express";
import OrderController from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

class OrderRouter {
    #route: Router;
    #orderController: OrderController;
    constructor() {
        this.#route = Router();
        this.#orderController = new OrderController();
        this.#initializeRoutes();
    }
    #initializeRoutes() {
        this.#route.post("/webhook", this.#orderController.handleMidtransWebhook);
        this.#route.post("/create/:restaurantId", this.#orderController.CreateOrder);
    }
    getRouter(): Router {
        return this.#route;
    }
}

export default OrderRouter;