import { Router } from "express";
import PlanController from "../controllers/plan.controller";
import { SuperAdminMiddleware } from "../middleware/role.middleware";

class PlanRouter {
  #route: Router;
  #planControlller: PlanController;
  constructor() {
    this.#route = Router();
    this.#planControlller = new PlanController();
    this.#initializeRoutes();
  }

  #initializeRoutes() {
    this.#route.get("/", this.#planControlller.GetAllPlans);
    this.#route.use(SuperAdminMiddleware);
    this.#route.get("/:id", this.#planControlller.GetPlanById);
    this.#route.post("/", this.#planControlller.CreatePlan);
    this.#route.patch("/:id", this.#planControlller.UpdatePlan);
    this.#route.patch("/delete/:id", this.#planControlller.DeletePlan);
  }
  getRouter():Router {
    return this.#route;
  }
}
export default PlanRouter;
