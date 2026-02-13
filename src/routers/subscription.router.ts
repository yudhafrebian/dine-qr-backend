import { Router } from "express";
import SubscriptionController from "../controllers/subscription.controller";
import { roleMiddleware } from "../middleware/role.middleware";

class SubscriptionRouter {
  #route: Router;
  #subscriptionControlller: SubscriptionController;
  constructor() {
    this.#route = Router();
    this.#subscriptionControlller = new SubscriptionController();
    this.#initializeRoutes();
  }
  #initializeRoutes() {
    this.#route.use(roleMiddleware(["ADMIN", "SUPER_ADMIN"]));
    this.#route.post("/create", this.#subscriptionControlller.CreatePayment);
  }
  getRouter(): Router {
    return this.#route;
  }
}

export default SubscriptionRouter;
